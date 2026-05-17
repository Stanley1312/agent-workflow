"""
Tests for StreamWorker — background thread that captures RTSP frames via cv2.

Coverage (maps to AC3, AC4):
  Happy path:
    - worker captures frames from VideoCapture and stores JPEG bytes in buffer
    - worker produces valid JPEG bytes (starts with JPEG magic bytes FF D8)

  Offline detection:
    - worker sets offline flag after N consecutive read() failures
    - worker marks itself online when capture.read() succeeds after being offline

  Edge cases:
    - worker is initially online when capture opens successfully
    - get_frame returns bytes (not None) even before first frame is captured (placeholder fallback)
"""
import threading
import time
import pytest
from unittest.mock import MagicMock, patch, PropertyMock


def _make_fake_frame():
    """Return a minimal valid numpy-like array that cv2.imencode will accept."""
    import numpy as np
    return np.zeros((10, 10, 3), dtype="uint8")


class TestStreamWorkerCapture:
    def test_worker_stores_jpeg_bytes_in_buffer(self):
        """Should capture a frame and store JPEG bytes in the internal frame buffer."""
        import numpy as np

        fake_frame = _make_fake_frame()
        fake_cap = MagicMock()
        fake_cap.isOpened.return_value = True
        fake_cap.read.return_value = (True, fake_frame)

        with patch("cv2.VideoCapture", return_value=fake_cap):
            from app.streams.worker import StreamWorker
            worker = StreamWorker(camera_id=1, rtsp_url="rtsp://fake/stream")
            worker.start()
            # give the thread a moment to capture at least one frame
            time.sleep(0.1)
            worker.stop()

        frame = worker.get_frame()
        assert frame is not None
        assert isinstance(frame, (bytes, bytearray))

    def test_worker_produces_jpeg_bytes(self):
        """Stored frame bytes should begin with the JPEG magic bytes FF D8."""
        import numpy as np

        fake_frame = _make_fake_frame()
        fake_cap = MagicMock()
        fake_cap.isOpened.return_value = True
        fake_cap.read.return_value = (True, fake_frame)

        with patch("cv2.VideoCapture", return_value=fake_cap):
            from app.streams.worker import StreamWorker
            worker = StreamWorker(camera_id=2, rtsp_url="rtsp://fake/stream")
            worker.start()
            time.sleep(0.1)
            worker.stop()

        frame = worker.get_frame()
        assert frame is not None
        assert frame[:2] == b"\xff\xd8", "Expected JPEG magic bytes FF D8"


class TestStreamWorkerOfflineDetection:
    def test_worker_sets_offline_after_n_consecutive_failures(self):
        """Should mark itself offline after N consecutive read() failures."""
        fake_cap = MagicMock()
        fake_cap.isOpened.return_value = True
        # read() always fails
        fake_cap.read.return_value = (False, None)

        with patch("cv2.VideoCapture", return_value=fake_cap):
            from app.streams.worker import StreamWorker
            worker = StreamWorker(camera_id=3, rtsp_url="rtsp://fake/stream")
            worker.start()
            # allow enough time for N failures to accumulate
            time.sleep(0.3)
            worker.stop()

        assert worker.is_offline(), "Worker should be offline after consecutive read() failures"

    def test_worker_is_online_when_capture_succeeds(self):
        """Should remain online when capture.read() returns valid frames."""
        import numpy as np

        fake_frame = _make_fake_frame()
        fake_cap = MagicMock()
        fake_cap.isOpened.return_value = True
        fake_cap.read.return_value = (True, fake_frame)

        with patch("cv2.VideoCapture", return_value=fake_cap):
            from app.streams.worker import StreamWorker
            worker = StreamWorker(camera_id=4, rtsp_url="rtsp://fake/stream")
            worker.start()
            time.sleep(0.1)
            worker.stop()

        assert not worker.is_offline(), "Worker should be online when frames are captured successfully"

    def test_worker_recovers_online_after_failed_then_successful_reads(self):
        """Should clear offline flag when capture.read() begins succeeding again."""
        import numpy as np

        fake_frame = _make_fake_frame()
        fake_cap = MagicMock()
        fake_cap.isOpened.return_value = True

        # First N calls fail, then succeed
        fail_results = [(False, None)] * 10
        success_results = [(True, fake_frame)] * 20
        fake_cap.read.side_effect = fail_results + success_results

        with patch("cv2.VideoCapture", return_value=fake_cap):
            from app.streams.worker import StreamWorker
            worker = StreamWorker(camera_id=5, rtsp_url="rtsp://fake/stream")
            worker.start()
            time.sleep(0.5)
            worker.stop()

        assert not worker.is_offline(), "Worker should recover online after successful reads"

    def test_worker_get_frame_returns_bytes_when_offline(self):
        """get_frame() should return bytes (placeholder) even when worker is offline."""
        fake_cap = MagicMock()
        fake_cap.isOpened.return_value = True
        fake_cap.read.return_value = (False, None)

        with patch("cv2.VideoCapture", return_value=fake_cap):
            from app.streams.worker import StreamWorker
            worker = StreamWorker(camera_id=6, rtsp_url="rtsp://fake/stream")
            worker.start()
            time.sleep(0.3)
            worker.stop()

        frame = worker.get_frame()
        assert frame is not None, "get_frame() must return bytes even when offline"
        assert isinstance(frame, (bytes, bytearray))
