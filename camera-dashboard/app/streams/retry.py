"""
RetryLoop: background thread that periodically retries offline cameras.
"""
import threading
import time


class RetryLoop:
    """
    Background thread that periodically retries offline cameras by calling
    manager.restart() on each offline camera.
    """

    def __init__(self, manager, interval=30):
        """
        Initialize the retry loop.

        Args:
            manager: StreamManager instance
            interval (float): Seconds between retry attempts (default 30)
        """
        self.manager = manager
        self.interval = interval
        self._stop_event = threading.Event()
        self._thread = None

    def start(self):
        """Start the background retry thread."""
        self._stop_event.clear()
        self._thread = threading.Thread(target=self._loop, daemon=True)
        self._thread.start()

    def stop(self):
        """Stop the background retry thread."""
        self._stop_event.set()
        if self._thread:
            self._thread.join(timeout=2.0)

    def _loop(self):
        """
        Main loop: sleep for interval, then iterate over offline cameras
        and call manager.restart() on each one.
        Thread-safe by copying the keys list before iterating.
        """
        while not self._stop_event.is_set():
            # Sleep for the interval before checking
            self._stop_event.wait(timeout=self.interval)

            if self._stop_event.is_set():
                break

            # Copy the keys list to avoid issues with dict being modified
            # while we iterate
            camera_ids = list(self.manager._workers.keys())

            for camera_id in camera_ids:
                if self._stop_event.is_set():
                    break

                # Only restart if the camera is offline
                if self.manager.is_offline(camera_id):
                    self.manager.restart(camera_id)
