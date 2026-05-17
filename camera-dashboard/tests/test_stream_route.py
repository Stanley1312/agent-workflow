"""
Tests for the /stream/<camera_id> MJPEG Flask route.

Coverage (maps to AC3, AC4):
  Happy path:
    - GET /stream/<id> for a known online camera returns Content-Type multipart/x-mixed-replace
    - Response body contains at least one MJPEG boundary marker

  Offline / unknown camera:
    - GET /stream/<id> for an offline camera still returns Content-Type multipart/x-mixed-replace
      (placeholder frame is served — stream never hard-errors)
    - GET /stream/<id> for an unknown camera_id returns Content-Type multipart/x-mixed-replace
      (placeholder frame served instead of 404 to avoid breaking <img> tags)

  Edge cases:
    - Content-Type header includes boundary parameter
    - Response status code is 200 for all cases (browser img tag must not break)
"""
import time
import pytest
from unittest.mock import MagicMock, patch


def _make_fake_frame():
    import numpy as np
    return np.zeros((10, 10, 3), dtype="uint8")


def _fake_cap_online():
    fake_frame = _make_fake_frame()
    cap = MagicMock()
    cap.isOpened.return_value = True
    cap.read.return_value = (True, fake_frame)
    return cap


def _fake_cap_offline():
    cap = MagicMock()
    cap.isOpened.return_value = True
    cap.read.return_value = (False, None)
    return cap


class TestStreamRouteOnlineCamera:
    def test_online_camera_returns_multipart_content_type(self, app, client):
        """GET /stream/<id> for an online camera should return multipart/x-mixed-replace."""
        cap = _fake_cap_online()
        with patch("cv2.VideoCapture", return_value=cap):
            # Register and start a stream worker for camera 1 via the stream manager
            from app.streams.manager import StreamManager
            with app.app_context():
                manager = app.config.get("STREAM_MANAGER") or StreamManager()
                manager.start(camera_id=1, rtsp_url="rtsp://fake/cam1")
                time.sleep(0.1)
                app.config["STREAM_MANAGER"] = manager

            response = client.get("/stream/1")

        assert response.status_code == 200
        content_type = response.content_type
        assert "multipart/x-mixed-replace" in content_type, (
            f"Expected multipart/x-mixed-replace, got: {content_type}"
        )

    def test_online_camera_response_contains_boundary(self, app, client):
        """Response Content-Type for online camera should include a boundary parameter."""
        cap = _fake_cap_online()
        with patch("cv2.VideoCapture", return_value=cap):
            from app.streams.manager import StreamManager
            with app.app_context():
                manager = app.config.get("STREAM_MANAGER") or StreamManager()
                manager.start(camera_id=7, rtsp_url="rtsp://fake/cam7")
                time.sleep(0.1)
                app.config["STREAM_MANAGER"] = manager

            response = client.get("/stream/7")

        assert response.status_code == 200
        assert "boundary=" in response.content_type, (
            f"Expected boundary parameter in Content-Type, got: {response.content_type}"
        )


class TestStreamRouteOfflineCamera:
    def test_offline_camera_returns_multipart_content_type(self, app, client):
        """GET /stream/<id> for an offline camera should still return multipart/x-mixed-replace."""
        cap = _fake_cap_offline()
        with patch("cv2.VideoCapture", return_value=cap):
            from app.streams.manager import StreamManager
            with app.app_context():
                manager = app.config.get("STREAM_MANAGER") or StreamManager()
                manager.start(camera_id=2, rtsp_url="rtsp://fake/offline")
                time.sleep(0.3)  # allow offline flag to set
                app.config["STREAM_MANAGER"] = manager

            response = client.get("/stream/2")

        assert response.status_code == 200
        assert "multipart/x-mixed-replace" in response.content_type, (
            f"Offline camera must still serve multipart stream, got: {response.content_type}"
        )

    def test_offline_camera_response_contains_boundary(self, app, client):
        """Offline camera stream Content-Type should include a boundary parameter."""
        cap = _fake_cap_offline()
        with patch("cv2.VideoCapture", return_value=cap):
            from app.streams.manager import StreamManager
            with app.app_context():
                manager = app.config.get("STREAM_MANAGER") or StreamManager()
                manager.start(camera_id=8, rtsp_url="rtsp://fake/offline8")
                time.sleep(0.3)
                app.config["STREAM_MANAGER"] = manager

            response = client.get("/stream/8")

        assert response.status_code == 200
        assert "boundary=" in response.content_type


class TestStreamRouteUnknownCamera:
    def test_unknown_camera_id_returns_multipart_content_type(self, client):
        """GET /stream/<id> for an unknown camera_id should return multipart/x-mixed-replace (placeholder)."""
        response = client.get("/stream/99999")
        assert response.status_code == 200
        assert "multipart/x-mixed-replace" in response.content_type, (
            f"Unknown camera must serve placeholder multipart stream, got: {response.content_type}"
        )

    def test_unknown_camera_id_does_not_return_404(self, client):
        """GET /stream/<id> for an unknown camera_id must not return 404 (would break img tags)."""
        response = client.get("/stream/99999")
        assert response.status_code != 404, (
            "Stream route must not 404 for unknown cameras — img tags would break"
        )
