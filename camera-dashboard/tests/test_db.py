"""
Tests for DB schema initialisation.

Coverage:
  - Happy path: init_db() creates the cameras table
  - Idempotency: calling init_db() twice does not raise and table still exists
  - Schema contract: expected columns are present
"""
import sqlite3
import pytest


class TestDBInit:
    def test_cameras_table_exists_after_init(self, app_ctx):
        """Should create the cameras table when init_db() is called."""
        from app.db import get_db
        db = get_db()
        cursor = db.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='cameras'"
        )
        row = cursor.fetchone()
        assert row is not None, "cameras table was not created by init_db()"

    def test_init_db_is_idempotent(self, app_ctx):
        """Should not raise when init_db() is called a second time (IF NOT EXISTS semantics)."""
        from app.db import init_db, get_db
        init_db()  # second call
        db = get_db()
        cursor = db.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='cameras'"
        )
        assert cursor.fetchone() is not None

    def test_cameras_table_has_expected_columns(self, app_ctx):
        """Should include id, name, ip, rtsp_url, username, password columns."""
        from app.db import get_db
        db = get_db()
        cursor = db.execute("PRAGMA table_info(cameras)")
        columns = {row["name"] for row in cursor.fetchall()}
        expected = {"id", "name", "ip", "rtsp_url", "username", "password"}
        missing = expected - columns
        assert not missing, f"Missing columns in cameras table: {missing}"
