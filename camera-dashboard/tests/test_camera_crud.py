"""
Tests for Camera model CRUD operations and all validation rules.

Coverage (maps to AC1, AC8 and SPEC edge cases):
  Happy paths:
    - create a valid camera
    - get a camera by id
    - list all cameras
    - update a camera
    - delete a camera

  Validation — max 10 cameras (AC8 / edge case: "11th camera added"):
    - adding an 11th camera raises / returns error

  Validation — unique name (edge case: "Duplicate camera name"):
    - duplicate name is rejected

  Validation — RTSP URL format (edge case: "Invalid RTSP URL format"):
    - URL not starting with rtsp:// is rejected
    - URL starting with rtsp:// is accepted

  Boundary / edge cases:
    - get with unknown id returns None
    - delete non-existent id is a no-op (does not raise)
    - update a non-existent id returns None or raises cleanly
    - exactly 10 cameras can be created (boundary below limit)
"""
import pytest


def _camera_data(**overrides):
    base = {
        "name": "Test Cam",
        "ip": "192.168.1.10",
        "rtsp_url": "rtsp://192.168.1.10:554/stream",
        "username": "admin",
        "password": "secret",
    }
    base.update(overrides)
    return base


class TestCameraCreate:
    def test_create_returns_camera_with_id(self, app_ctx):
        """Should persist a valid camera and return it with an assigned id."""
        from app.models.camera import Camera
        cam = Camera.create(**_camera_data())
        assert cam is not None
        assert cam["id"] is not None
        assert cam["name"] == "Test Cam"

    def test_create_stores_all_fields(self, app_ctx):
        """Should store all provided fields correctly."""
        from app.models.camera import Camera
        data = _camera_data(name="Garage", ip="10.0.0.5", rtsp_url="rtsp://10.0.0.5/cam")
        cam = Camera.create(**data)
        fetched = Camera.get(cam["id"])
        assert fetched["name"] == "Garage"
        assert fetched["ip"] == "10.0.0.5"
        assert fetched["rtsp_url"] == "rtsp://10.0.0.5/cam"

    def test_create_rejects_non_rtsp_url(self, app_ctx):
        """Should reject a camera whose rtsp_url does not start with rtsp://."""
        from app.models.camera import Camera, ValidationError
        with pytest.raises(ValidationError, match="rtsp://"):
            Camera.create(**_camera_data(rtsp_url="http://192.168.1.1/stream"))

    def test_create_rejects_empty_rtsp_url(self, app_ctx):
        """Should reject a camera with an empty rtsp_url."""
        from app.models.camera import Camera, ValidationError
        with pytest.raises(ValidationError):
            Camera.create(**_camera_data(rtsp_url=""))

    def test_create_rejects_duplicate_name(self, app_ctx):
        """Should reject a second camera with the same name."""
        from app.models.camera import Camera, ValidationError
        Camera.create(**_camera_data(name="FrontDoor"))
        with pytest.raises(ValidationError, match="unique"):
            Camera.create(**_camera_data(name="FrontDoor", ip="10.0.0.99"))

    def test_create_allows_same_ip_different_name(self, app_ctx):
        """Should allow two cameras with the same IP but different names."""
        from app.models.camera import Camera
        cam1 = Camera.create(**_camera_data(name="Cam A", ip="192.168.1.1"))
        cam2 = Camera.create(**_camera_data(name="Cam B", ip="192.168.1.1"))
        assert cam1["id"] != cam2["id"]

    def test_create_exactly_ten_cameras_succeeds(self, app_ctx):
        """Should allow creating up to 10 cameras (boundary)."""
        from app.models.camera import Camera
        for i in range(10):
            Camera.create(**_camera_data(name=f"Cam{i}", ip=f"10.0.0.{i}"))
        cameras = Camera.list()
        assert len(cameras) == 10

    def test_create_eleventh_camera_is_rejected(self, app_ctx):
        """Should reject an 11th camera with 'Max 10 cameras allowed' error."""
        from app.models.camera import Camera, ValidationError
        for i in range(10):
            Camera.create(**_camera_data(name=f"Cam{i}", ip=f"10.0.0.{i}"))
        with pytest.raises(ValidationError, match="[Mm]ax 10"):
            Camera.create(**_camera_data(name="Cam10", ip="10.0.0.10"))


class TestCameraGet:
    def test_get_existing_camera_returns_correct_data(self, app_ctx):
        """Should return the correct camera dict for a valid id."""
        from app.models.camera import Camera
        cam = Camera.create(**_camera_data(name="GetTest"))
        fetched = Camera.get(cam["id"])
        assert fetched["id"] == cam["id"]
        assert fetched["name"] == "GetTest"

    def test_get_nonexistent_id_returns_none(self, app_ctx):
        """Should return None when the requested id does not exist."""
        from app.models.camera import Camera
        result = Camera.get(99999)
        assert result is None


class TestCameraList:
    def test_list_returns_empty_when_no_cameras(self, app_ctx):
        """Should return an empty list when no cameras exist."""
        from app.models.camera import Camera
        cameras = Camera.list()
        assert cameras == []

    def test_list_returns_all_cameras(self, app_ctx):
        """Should return all created cameras."""
        from app.models.camera import Camera
        Camera.create(**_camera_data(name="A", ip="10.0.0.1"))
        Camera.create(**_camera_data(name="B", ip="10.0.0.2"))
        cameras = Camera.list()
        assert len(cameras) == 2
        names = {c["name"] for c in cameras}
        assert names == {"A", "B"}


class TestCameraUpdate:
    def test_update_changes_field(self, app_ctx):
        """Should persist the updated field value."""
        from app.models.camera import Camera
        cam = Camera.create(**_camera_data(name="Original"))
        updated = Camera.update(cam["id"], name="Updated", ip=cam["ip"],
                                rtsp_url=cam["rtsp_url"], username=cam["username"],
                                password=cam["password"])
        assert updated["name"] == "Updated"
        fetched = Camera.get(cam["id"])
        assert fetched["name"] == "Updated"

    def test_update_rejects_non_rtsp_url(self, app_ctx):
        """Should reject an update that sets a non-rtsp:// URL."""
        from app.models.camera import Camera, ValidationError
        cam = Camera.create(**_camera_data())
        with pytest.raises(ValidationError, match="rtsp://"):
            Camera.update(cam["id"], name=cam["name"], ip=cam["ip"],
                          rtsp_url="ftp://bad.url", username=cam["username"],
                          password=cam["password"])

    def test_update_rejects_duplicate_name(self, app_ctx):
        """Should reject an update that would create a duplicate name."""
        from app.models.camera import Camera, ValidationError
        cam1 = Camera.create(**_camera_data(name="Alpha", ip="10.0.0.1"))
        cam2 = Camera.create(**_camera_data(name="Beta", ip="10.0.0.2"))
        with pytest.raises(ValidationError, match="unique"):
            Camera.update(cam2["id"], name="Alpha", ip=cam2["ip"],
                          rtsp_url=cam2["rtsp_url"], username=cam2["username"],
                          password=cam2["password"])

    def test_update_nonexistent_id_returns_none_or_raises(self, app_ctx):
        """Should return None or raise cleanly when camera id does not exist."""
        from app.models.camera import Camera
        result = Camera.update(99999, name="Ghost", ip="0.0.0.0",
                               rtsp_url="rtsp://0.0.0.0/stream",
                               username="u", password="p")
        assert result is None


class TestCameraDelete:
    def test_delete_removes_camera(self, app_ctx):
        """Should remove the camera so it no longer appears in list or get."""
        from app.models.camera import Camera
        cam = Camera.create(**_camera_data(name="ToDelete"))
        Camera.delete(cam["id"])
        assert Camera.get(cam["id"]) is None
        cameras = Camera.list()
        assert all(c["id"] != cam["id"] for c in cameras)

    def test_delete_nonexistent_id_does_not_raise(self, app_ctx):
        """Should silently succeed when deleting an id that does not exist."""
        from app.models.camera import Camera
        Camera.delete(99999)  # must not raise
