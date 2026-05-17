"""
Tests for GET /status JSON endpoint.
Wave 5: Stream Auto-Retry — status reporting.

The /status route does not exist yet — all tests here should fail with 404
until the Implementor creates app/routes/status.py and registers the blueprint.
"""
import json
from unittest.mock import MagicMock


# ---------------------------------------------------------------------------
# Helper — build a fake StreamManager worker registry so route tests can
# work without real RTSP connections.
# ---------------------------------------------------------------------------

def _make_offline_worker(offline: bool) -> MagicMock:
    """Return a mock StreamWorker whose is_offline() returns the given value."""
    worker = MagicMock()
    worker.is_offline.return_value = offline
    return worker


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------


class TestStatusRoute:
    """GET /status returns a JSON map of camera_id -> 'up' | 'down'."""

    def test_status_returns_200_with_no_cameras(self, client, app):
        """
        Given no cameras exist in the DB
        When GET /status is requested
        Then the response is HTTP 200 with Content-Type application/json and body {}
        """
        response = client.get("/status")

        assert response.status_code == 200, (
            f"Expected 200 but got {response.status_code}. "
            "The /status route has not been implemented yet."
        )
        assert response.content_type.startswith("application/json")
        data = json.loads(response.data)
        assert data == {}

    def test_status_returns_one_entry_per_camera(self, client, app):
        """
        Given two cameras exist in the DB
        When GET /status is requested
        Then the response JSON contains exactly two entries.
        """
        from app.models.camera import Camera

        with app.app_context():
            Camera.create(
                name="cam-alpha",
                ip="192.168.1.10",
                rtsp_url="rtsp://192.168.1.10/stream1",
                username="admin",
                password="pass",
            )
            Camera.create(
                name="cam-beta",
                ip="192.168.1.11",
                rtsp_url="rtsp://192.168.1.11/stream1",
                username="admin",
                password="pass",
            )

        response = client.get("/status")

        assert response.status_code == 200
        data = json.loads(response.data)
        assert len(data) == 2, f"Expected 2 entries but got {len(data)}: {data}"

    def test_status_value_is_string_up_or_down(self, client, app):
        """
        Given cameras exist
        When GET /status is requested
        Then every value in the JSON is exactly the string 'up' or 'down'
        """
        from app.models.camera import Camera

        with app.app_context():
            Camera.create(
                name="cam-check",
                ip="192.168.1.20",
                rtsp_url="rtsp://192.168.1.20/stream1",
                username="admin",
                password="pass",
            )

        response = client.get("/status")

        assert response.status_code == 200
        data = json.loads(response.data)
        for camera_id, status in data.items():
            assert status in ("up", "down"), (
                f"Camera {camera_id!r} has unexpected status {status!r}; "
                "only 'up' or 'down' are valid."
            )

    def test_online_worker_reported_as_up(self, client, app):
        """
        Given a camera whose StreamWorker reports is_offline() == False
        When GET /status is requested
        Then that camera's entry in the JSON is 'up'
        """
        from app.models.camera import Camera

        with app.app_context():
            cam = Camera.create(
                name="cam-online",
                ip="192.168.1.30",
                rtsp_url="rtsp://192.168.1.30/stream1",
                username="admin",
                password="pass",
            )
            cam_id = str(cam["id"])

        # Inject a mock worker that says the camera is online
        app.stream_manager._workers[cam_id] = _make_offline_worker(offline=False)

        try:
            response = client.get("/status")
            assert response.status_code == 200
            data = json.loads(response.data)
            assert cam_id in data, f"Camera {cam_id!r} not found in status response: {data}"
            assert data[cam_id] == "up", (
                f"Expected 'up' for online camera but got {data[cam_id]!r}"
            )
        finally:
            # Clean up injected mock so it doesn't pollute other tests
            app.stream_manager._workers.pop(cam_id, None)

    def test_offline_worker_reported_as_down(self, client, app):
        """
        Given a camera whose StreamWorker reports is_offline() == True
        When GET /status is requested
        Then that camera's entry in the JSON is 'down'
        """
        from app.models.camera import Camera

        with app.app_context():
            cam = Camera.create(
                name="cam-offline",
                ip="192.168.1.40",
                rtsp_url="rtsp://192.168.1.40/stream1",
                username="admin",
                password="pass",
            )
            cam_id = str(cam["id"])

        # Inject a mock worker that says the camera is offline
        app.stream_manager._workers[cam_id] = _make_offline_worker(offline=True)

        try:
            response = client.get("/status")
            assert response.status_code == 200
            data = json.loads(response.data)
            assert cam_id in data, f"Camera {cam_id!r} not found in status response: {data}"
            assert data[cam_id] == "down", (
                f"Expected 'down' for offline camera but got {data[cam_id]!r}"
            )
        finally:
            app.stream_manager._workers.pop(cam_id, None)
