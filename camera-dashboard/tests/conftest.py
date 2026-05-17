"""
Shared pytest fixtures for Camera Dashboard tests.
"""
import os
import tempfile
import pytest


@pytest.fixture
def db_path(tmp_path):
    """Return a path to a temporary SQLite database file."""
    return str(tmp_path / "test_cameras.db")


@pytest.fixture
def app(db_path):
    """Create a Flask test app instance with an isolated temp DB."""
    from app import create_app

    test_config = {
        "TESTING": True,
        "DATABASE": db_path,
    }
    application = create_app(test_config)

    with application.app_context():
        from app.db import init_db
        init_db()

    yield application


@pytest.fixture
def client(app):
    """Flask test client bound to the test app."""
    return app.test_client()


@pytest.fixture
def app_ctx(app):
    """Push an application context for tests that need it outside a request."""
    with app.app_context():
        yield app
