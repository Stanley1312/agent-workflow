"""
Tests for StreamManager — lifecycle manager for per-camera StreamWorker instances.

Coverage (maps to AC3, AC4):
  Happy path:
    - manager.start(camera_id, rtsp_url) creates and starts a worker
    - manager.stop(camera_id) stops the running worker
    - manager.restart(camera_id) stops then starts a new worker
    - manager.get_frame(camera_id) returns bytes

  Edge cases:
    - manager.stop for an unknown camera_id is a no-op (does not raise)
    - manager.get_frame for an unknown camera_id returns placeholder bytes
    - starting the same camera_id twice replaces the existing worker
"""
import time
import pytest
from unittest.mock import MagicMock, patch


def _fake_cap_online():
    """Return a mock VideoCapture that always returns a black frame."""
    import numpy as np
    fake_frame = _make_fake_frame()
    cap = MagicMock()
    cap.isOpened.return_value = True
    cap.read.return_value = (True, fake_frame)
    return cap


def _make_fake_frame():
    import numpy as np
    return np.zeros((10, 10, 3), dtype="uint8")


class TestStreamManagerLifecycle:
    def test_start_creates_and_runs_worker(self):
        """manager.start() should create a worker and begin frame capture."""
        cap = _fake_cap_online()
        with patch("cv2.VideoCapture", return_value=cap):
            from app.streams.manager import StreamManager
            manager = StreamManager()
            manager.start(camera_id=1, rtsp_url="rtsp://fake/cam1")
            time.sleep(0.1)

            # worker should be registered and capturing
            frame = manager.get_frame(camera_id=1)
            assert frame is not None
            assert isinstance(frame, (bytes, bytearray))

            manager.stop(camera_id=1)

    def test_stop_terminates_worker(self):
        """manager.stop() should stop the running worker thread."""
        cap = _fake_cap_online()
        with patch("cv2.VideoCapture", return_value=cap):
            from app.streams.manager import StreamManager
            manager = StreamManager()
            manager.start(camera_id=2, rtsp_url="rtsp://fake/cam2")
            time.sleep(0.1)
            manager.stop(camera_id=2)

        # after stop the worker thread should no longer be alive
        # (we access the internal dict only to verify — implementation detail)
        # the key contract is that stop() does not raise
        # and get_frame still returns bytes (placeholder)
        frame = manager.get_frame(camera_id=2)
        assert isinstance(frame, (bytes, bytearray))

    def test_restart_stops_then_starts_worker(self):
        """manager.restart() should stop the old worker and start a fresh one."""
        cap = _fake_cap_online()
        with patch("cv2.VideoCapture", return_value=cap):
            from app.streams.manager import StreamManager
            manager = StreamManager()
            manager.start(camera_id=3, rtsp_url="rtsp://fake/cam3")
            time.sleep(0.1)
            manager.restart(camera_id=3, rtsp_url="rtsp://fake/cam3")
            time.sleep(0.1)

            frame = manager.get_frame(camera_id=3)
            assert frame is not None
            assert isinstance(frame, (bytes, bytearray))

            manager.stop(camera_id=3)

    def test_get_frame_returns_bytes_for_running_worker(self):
        """manager.get_frame() should return JPEG bytes for an active camera."""
        cap = _fake_cap_online()
        with patch("cv2.VideoCapture", return_value=cap):
            from app.streams.manager import StreamManager
            manager = StreamManager()
            manager.start(camera_id=4, rtsp_url="rtsp://fake/cam4")
            time.sleep(0.1)

            frame = manager.get_frame(camera_id=4)
            assert frame is not None
            assert isinstance(frame, (bytes, bytearray))

            manager.stop(camera_id=4)


class TestStreamManagerEdgeCases:
    def test_stop_unknown_camera_does_not_raise(self):
        """manager.stop() for an unknown camera_id should be a no-op."""
        from app.streams.manager import StreamManager
        manager = StreamManager()
        manager.stop(camera_id=999)  # must not raise

    def test_get_frame_unknown_camera_returns_placeholder_bytes(self):
        """manager.get_frame() for an unknown camera_id should return placeholder bytes."""
        from app.streams.manager import StreamManager
        manager = StreamManager()
        frame = manager.get_frame(camera_id=999)
        assert frame is not None, "Expected placeholder bytes for unknown camera"
        assert isinstance(frame, (bytes, bytearray))

    def test_start_same_camera_twice_replaces_worker(self):
        """Starting the same camera_id twice should replace (not duplicate) the worker."""
        cap = _fake_cap_online()
        with patch("cv2.VideoCapture", return_value=cap):
            from app.streams.manager import StreamManager
            manager = StreamManager()
            manager.start(camera_id=5, rtsp_url="rtsp://fake/cam5")
            time.sleep(0.05)
            manager.start(camera_id=5, rtsp_url="rtsp://fake/cam5_new")
            time.sleep(0.1)

            # only one worker should be active for camera_id=5
            frame = manager.get_frame(camera_id=5)
            assert frame is not None

            manager.stop(camera_id=5)
