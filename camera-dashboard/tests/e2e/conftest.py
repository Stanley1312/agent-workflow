"""
Playwright E2E fixtures: Flask test server running in a background thread
with an isolated temp SQLite DB, plus a base_url fixture for page navigation.
"""
import os
import socket
import tempfile
import threading
import time

import pytest


def _find_free_port():
    """Bind to port 0 and return the OS-assigned ephemeral port."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


@pytest.fixture(scope="session")
def flask_server():
    """
    Spin up a Flask app in a background thread for the whole test session.
    Uses a temp SQLite DB so tests are isolated from real data.
    Yields the base URL (http://127.0.0.1:<port>).
    """
    db_fd, db_path = tempfile.mkstemp(suffix=".db")
    os.close(db_fd)

    port = _find_free_port()

    from app import create_app
    test_config = {
        "TESTING": True,
        "SECRET_KEY": "e2e-test-secret",
        "DATABASE": db_path,
    }
    application = create_app(test_config)
    application.config["SERVER_NAME"] = None  # allow url_for without SERVER_NAME

    def run():
        application.run(host="127.0.0.1", port=port, use_reloader=False, threaded=True)

    thread = threading.Thread(target=run, daemon=True)
    thread.start()

    # Wait until server is accepting connections (max 10s)
    deadline = time.time() + 10
    while time.time() < deadline:
        try:
            with socket.create_connection(("127.0.0.1", port), timeout=0.5):
                break
        except OSError:
            time.sleep(0.1)
    else:
        raise RuntimeError(f"Flask server did not start on port {port}")

    base_url = f"http://127.0.0.1:{port}"
    yield base_url, application

    # Temp DB cleanup
    try:
        os.unlink(db_path)
    except OSError:
        pass


@pytest.fixture()
def live_server(flask_server):
    """Convenience fixture: return just the base URL string."""
    base_url, _ = flask_server
    return base_url


@pytest.fixture()
def app_instance(flask_server):
    """Convenience fixture: return just the Flask app instance."""
    _, application = flask_server
    return application


@pytest.fixture()
def page(browser, live_server):
    """
    pytest-playwright `page` override that pre-navigates to the live server
    root so tests can use relative paths via page.goto('/some/path').
    Yields a Playwright Page object; context is closed after each test.
    """
    context = browser.new_context(base_url=live_server)
    pg = context.new_page()
    yield pg
    context.close()


@pytest.fixture()
def seeded_camera(app_instance, live_server):
    """
    Insert one camera into the DB before the test and remove it after.
    Returns the camera dict so tests can reference its id/name.
    """
    with app_instance.app_context():
        from app.models.camera import Camera
        camera = Camera.create(
            name="Test Camera",
            ip="192.168.1.100",
            rtsp_url="rtsp://192.168.1.100/stream",
            username="admin",
            password="admin123",
        )
    yield camera
    with app_instance.app_context():
        from app.models.camera import Camera
        try:
            Camera.delete(camera["id"])
        except Exception:
            pass
