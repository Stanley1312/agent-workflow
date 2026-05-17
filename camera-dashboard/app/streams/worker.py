"""
StreamWorker: background thread that captures RTSP frames via OpenCV.
"""
import threading
import cv2
from app.streams.placeholder import PLACEHOLDER_FRAME

OFFLINE_THRESHOLD = 5


class StreamWorker:
    """
    Captures frames from an RTSP URL in a background thread.
    Maintains a frame buffer and offline flag.
    """

    def __init__(self, camera_id, rtsp_url):
        self.camera_id = camera_id
        self.rtsp_url = rtsp_url
        self._frame_buffer = PLACEHOLDER_FRAME
        self._offline = True
        self._fail_counter = 0
        self._lock = threading.Lock()
        self._stop_event = threading.Event()
        self._thread = None

    def start(self):
        """Start the background capture thread."""
        self._stop_event.clear()
        self._thread = threading.Thread(target=self._capture_loop, daemon=True)
        self._thread.start()

    def stop(self):
        """Stop the background capture thread."""
        self._stop_event.set()
        if self._thread:
            self._thread.join(timeout=2.0)

    def _capture_loop(self):
        """
        Main capture loop: open VideoCapture, read frames, encode as JPEG,
        store in buffer. Handle offline detection.
        """
        cap = cv2.VideoCapture(self.rtsp_url)
        try:
            if not cap.isOpened():
                # Could not open stream at all
                with self._lock:
                    self._offline = True
                return

            while not self._stop_event.is_set():
                ret, frame = cap.read()
                if ret:
                    # Successfully read a frame
                    success, buffer = cv2.imencode(".jpg", frame)
                    if success:
                        with self._lock:
                            self._frame_buffer = bytes(buffer)
                            self._fail_counter = 0
                            self._offline = False
                else:
                    # read() failed
                    with self._lock:
                        self._fail_counter += 1
                        if self._fail_counter >= OFFLINE_THRESHOLD:
                            self._offline = True

                # Sleep to maintain approximately 30 FPS
                if not self._stop_event.is_set():
                    self._stop_event.wait(timeout=0.033)
        finally:
            cap.release()

    def get_frame(self) -> bytes:
        """Return the current frame buffer (thread-safe)."""
        with self._lock:
            return self._frame_buffer

    def is_offline(self) -> bool:
        """Return the offline flag (thread-safe)."""
        with self._lock:
            return self._offline

    def is_online(self) -> bool:
        """Return the inverse of is_offline (thread-safe)."""
        return not self.is_offline()

    def restart(self):
        """Stop and start the worker thread."""
        self.stop()
        self.start()
