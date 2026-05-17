"""
StreamManager: manages a collection of StreamWorker instances per camera.
"""
from app.streams.worker import StreamWorker
from app.streams.placeholder import PLACEHOLDER_FRAME


class StreamManager:
    """
    Manages lifecycle of per-camera StreamWorker instances.
    """

    def __init__(self):
        self._workers = {}

    def start(self, camera_id, rtsp_url):
        """
        Start a stream worker for the given camera.
        If the camera already exists, stop it first before replacing.
        """
        if camera_id in self._workers:
            self.stop(camera_id)

        worker = StreamWorker(camera_id, rtsp_url)
        worker.start()
        self._workers[camera_id] = worker

    def stop(self, camera_id):
        """
        Stop and remove a stream worker. No-op if not found.
        """
        if camera_id in self._workers:
            worker = self._workers.pop(camera_id)
            worker.stop()

    def restart(self, camera_id, rtsp_url=None):
        """
        Restart a stream worker (stop then start).
        If rtsp_url is provided, updates the worker's URL.
        No-op if the worker does not exist.
        """
        if camera_id in self._workers:
            if rtsp_url is not None:
                self.stop(camera_id)
                self.start(camera_id, rtsp_url)
            else:
                self._workers[camera_id].restart()

    def get_frame(self, camera_id) -> bytes:
        """
        Get the current frame for a camera.
        Returns placeholder bytes if camera not found.
        """
        if camera_id in self._workers:
            return self._workers[camera_id].get_frame()
        return PLACEHOLDER_FRAME

    def is_offline(self, camera_id) -> bool:
        """
        Check if a camera is offline.
        Returns True if camera not found or offline flag is set.
        """
        if camera_id in self._workers:
            return self._workers[camera_id].is_offline()
        return True
