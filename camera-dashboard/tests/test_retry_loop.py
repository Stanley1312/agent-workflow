"""
Tests for the RetryLoop — background thread that calls manager.restart()
on offline workers every N seconds.

Wave 5: Stream Auto-Retry.

The RetryLoop class does not exist yet (it will live in app/streams/retry.py).
All tests here should fail with ImportError until the Implementor creates it.

Design contract the Implementor must satisfy:
    from app.streams.retry import RetryLoop

    loop = RetryLoop(manager, interval=<seconds: float>)
    loop.start()   # starts daemon thread
    loop.stop()    # signals thread to exit and joins it
"""
import time
from unittest.mock import MagicMock, call

import pytest

# This import will fail (ImportError) until the Implementor creates the module —
# that is the intended RED state.
from app.streams.retry import RetryLoop  # noqa: will raise ImportError in RED phase


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _make_manager(camera_ids_offline: dict) -> MagicMock:
    """
    Build a mock StreamManager.

    camera_ids_offline: {camera_id: is_offline_bool}
    manager.workers property returns a dict-like view of camera IDs.
    manager.is_offline(camera_id) returns the mapped bool.
    manager.restart(camera_id) is a mock that records calls.
    """
    manager = MagicMock()
    manager.is_offline.side_effect = lambda cid: camera_ids_offline.get(cid, True)
    # Expose the list of known camera IDs via a property
    manager._workers = {cid: MagicMock() for cid in camera_ids_offline}
    return manager


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------

class TestRetryLoop:
    """RetryLoop re-tries offline cameras and ignores online ones."""

    def test_restart_called_for_offline_camera(self):
        """
        Given a StreamManager with one offline camera
        When RetryLoop runs for at least one interval (0.05s)
        Then manager.restart() is called with that camera's id
        """
        camera_id = "1"
        manager = _make_manager({camera_id: True})  # camera is offline

        loop = RetryLoop(manager, interval=0.05)
        loop.start()
        time.sleep(0.15)  # allow at least one full interval to elapse
        loop.stop()

        manager.restart.assert_called_with(camera_id)

    def test_restart_not_called_for_online_camera(self):
        """
        Given a StreamManager with one online camera
        When RetryLoop runs for at least one interval (0.05s)
        Then manager.restart() is NOT called for that camera
        """
        camera_id = "2"
        manager = _make_manager({camera_id: False})  # camera is online

        loop = RetryLoop(manager, interval=0.05)
        loop.start()
        time.sleep(0.15)
        loop.stop()

        # restart must never have been called
        manager.restart.assert_not_called()

    def test_restart_called_only_for_offline_among_mixed(self):
        """
        Given a StreamManager with one online camera and one offline camera
        When RetryLoop runs for at least one interval
        Then manager.restart() is called exactly for the offline camera,
        and never for the online camera.
        """
        offline_id = "10"
        online_id = "11"
        manager = _make_manager({offline_id: True, online_id: False})

        loop = RetryLoop(manager, interval=0.05)
        loop.start()
        time.sleep(0.15)
        loop.stop()

        # restart must have been called for the offline camera
        assert call(offline_id) in manager.restart.call_args_list, (
            f"Expected manager.restart('{offline_id}') to be called, "
            f"but calls were: {manager.restart.call_args_list}"
        )

        # restart must NOT have been called for the online camera
        assert call(online_id) not in manager.restart.call_args_list, (
            f"manager.restart('{online_id}') should NOT have been called, "
            f"but calls were: {manager.restart.call_args_list}"
        )

    def test_retry_loop_runs_multiple_intervals(self):
        """
        Given a RetryLoop with a short interval
        When enough time passes for multiple intervals to elapse
        Then manager.restart() is called multiple times for the offline camera
        """
        camera_id = "20"
        manager = _make_manager({camera_id: True})

        loop = RetryLoop(manager, interval=0.05)
        loop.start()
        time.sleep(0.30)  # enough time for ~6 intervals
        loop.stop()

        # restart should have been called more than once
        assert manager.restart.call_count >= 2, (
            f"Expected at least 2 restart calls but got {manager.restart.call_count}"
        )
