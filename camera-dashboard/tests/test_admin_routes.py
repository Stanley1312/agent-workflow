"""
Tests for admin panel routes.

Coverage (maps to AC1, AC8, UX Flow 1 & 4):
  GET /admin:
    - returns 200
    - renders the camera list (existing cameras appear in response)
    - renders the Add Camera form (input fields present)

  POST /admin/add:
    - valid submission creates camera and redirects (302)
    - invalid RTSP URL returns form with error message
    - duplicate name returns form with error message
    - 11th camera returns form with "Max 10 cameras allowed" error

  POST /admin/edit/<id>:
    - valid update persists changes and redirects
    - invalid RTSP URL returns form with error
    - duplicate name update returns form with error
    - unknown id returns 404

  POST /admin/delete/<id>:
    - valid delete removes camera and redirects
    - unknown id returns 404
"""
import pytest


def _post_add(client, **overrides):
    data = {
        "name": "Test Cam",
        "ip": "192.168.1.10",
        "rtsp_url": "rtsp://192.168.1.10:554/stream",
        "username": "admin",
        "password": "secret",
    }
    data.update(overrides)
    return client.post("/admin/add", data=data, follow_redirects=False)


def _create_camera(app_ctx, **overrides):
    from app.models.camera import Camera
    defaults = {
        "name": "Existing",
        "ip": "192.168.1.1",
        "rtsp_url": "rtsp://192.168.1.1/stream",
        "username": "admin",
        "password": "pass",
    }
    defaults.update(overrides)
    with app_ctx.app_context():
        return Camera.create(**defaults)


class TestAdminGet:
    def test_get_admin_returns_200(self, client):
        """Should return HTTP 200 for GET /admin."""
        response = client.get("/admin")
        assert response.status_code == 200

    def test_get_admin_contains_add_form_fields(self, client):
        """Should render input fields for name, ip, rtsp_url, username, password."""
        response = client.get("/admin")
        html = response.data.decode()
        for field in ("name", "ip", "rtsp_url", "username", "password"):
            assert field in html, f"Expected form field '{field}' not found in /admin response"

    def test_get_admin_lists_existing_cameras(self, client, app):
        """Should display existing cameras in the page."""
        with app.app_context():
            from app.models.camera import Camera
            Camera.create(name="FrontDoor", ip="10.0.0.1",
                          rtsp_url="rtsp://10.0.0.1/stream",
                          username="u", password="p")
        response = client.get("/admin")
        html = response.data.decode()
        assert "FrontDoor" in html, "Existing camera name not found in /admin response"

    def test_get_admin_shows_no_cameras_when_empty(self, client):
        """Should not crash and render gracefully when no cameras exist."""
        response = client.get("/admin")
        assert response.status_code == 200


class TestAdminAdd:
    def test_post_add_valid_camera_redirects(self, client):
        """Should redirect after successfully creating a valid camera."""
        response = _post_add(client)
        assert response.status_code == 302

    def test_post_add_valid_camera_persists(self, client, app):
        """Should persist the new camera to the database."""
        _post_add(client, name="NewCam")
        with app.app_context():
            from app.models.camera import Camera
            cameras = Camera.list()
        assert any(c["name"] == "NewCam" for c in cameras)

    def test_post_add_invalid_rtsp_url_shows_error(self, client):
        """Should return the form with a validation error for a non-rtsp:// URL."""
        response = _post_add(client, rtsp_url="http://bad.url/stream",
                             follow_redirects=True)
        html = response.data.decode()
        assert response.status_code == 200
        assert "rtsp://" in html.lower() or "invalid" in html.lower() or "error" in html.lower()

    def test_post_add_duplicate_name_shows_error(self, client, app):
        """Should return the form with a uniqueness error for a duplicate name."""
        with app.app_context():
            from app.models.camera import Camera
            Camera.create(name="Dup", ip="10.0.0.1",
                          rtsp_url="rtsp://10.0.0.1/s", username="u", password="p")
        response = _post_add(client, name="Dup", ip="10.0.0.2")
        html = response.data.decode()
        assert response.status_code == 200
        assert "unique" in html.lower() or "error" in html.lower() or "already" in html.lower()

    def test_post_add_eleventh_camera_shows_max_error(self, client, app):
        """Should return form error 'Max 10 cameras allowed' when adding the 11th."""
        with app.app_context():
            from app.models.camera import Camera
            for i in range(10):
                Camera.create(name=f"Cam{i}", ip=f"10.0.0.{i}",
                              rtsp_url=f"rtsp://10.0.0.{i}/s",
                              username="u", password="p")
        response = _post_add(client, name="Cam10", ip="10.0.0.10")
        html = response.data.decode()
        assert response.status_code == 200
        assert "10" in html and ("max" in html.lower() or "allowed" in html.lower() or "error" in html.lower())


class TestAdminEdit:
    def test_post_edit_valid_update_redirects(self, client, app):
        """Should redirect after a valid camera update."""
        with app.app_context():
            from app.models.camera import Camera
            cam = Camera.create(name="EditMe", ip="10.0.0.1",
                                rtsp_url="rtsp://10.0.0.1/s",
                                username="u", password="p")
        response = client.post(f"/admin/edit/{cam['id']}", data={
            "name": "Edited",
            "ip": "10.0.0.1",
            "rtsp_url": "rtsp://10.0.0.1/s",
            "username": "u",
            "password": "p",
        }, follow_redirects=False)
        assert response.status_code == 302

    def test_post_edit_persists_change(self, client, app):
        """Should persist the updated name to the database."""
        with app.app_context():
            from app.models.camera import Camera
            cam = Camera.create(name="OldName", ip="10.0.0.1",
                                rtsp_url="rtsp://10.0.0.1/s",
                                username="u", password="p")
        client.post(f"/admin/edit/{cam['id']}", data={
            "name": "NewName",
            "ip": "10.0.0.1",
            "rtsp_url": "rtsp://10.0.0.1/s",
            "username": "u",
            "password": "p",
        }, follow_redirects=False)
        with app.app_context():
            from app.models.camera import Camera
            fetched = Camera.get(cam["id"])
        assert fetched["name"] == "NewName"

    def test_post_edit_invalid_rtsp_url_shows_error(self, client, app):
        """Should return form with error when updated rtsp_url is invalid."""
        with app.app_context():
            from app.models.camera import Camera
            cam = Camera.create(name="EditErr", ip="10.0.0.1",
                                rtsp_url="rtsp://10.0.0.1/s",
                                username="u", password="p")
        response = client.post(f"/admin/edit/{cam['id']}", data={
            "name": "EditErr",
            "ip": "10.0.0.1",
            "rtsp_url": "http://bad.url",
            "username": "u",
            "password": "p",
        }, follow_redirects=True)
        assert response.status_code == 200
        html = response.data.decode()
        assert "rtsp://" in html.lower() or "invalid" in html.lower() or "error" in html.lower()

    def test_post_edit_duplicate_name_shows_error(self, client, app):
        """Should return form with error when the updated name clashes with another camera."""
        with app.app_context():
            from app.models.camera import Camera
            cam1 = Camera.create(name="Alpha", ip="10.0.0.1",
                                 rtsp_url="rtsp://10.0.0.1/s",
                                 username="u", password="p")
            cam2 = Camera.create(name="Beta", ip="10.0.0.2",
                                 rtsp_url="rtsp://10.0.0.2/s",
                                 username="u", password="p")
        response = client.post(f"/admin/edit/{cam2['id']}", data={
            "name": "Alpha",
            "ip": "10.0.0.2",
            "rtsp_url": "rtsp://10.0.0.2/s",
            "username": "u",
            "password": "p",
        }, follow_redirects=True)
        assert response.status_code == 200
        html = response.data.decode()
        assert "unique" in html.lower() or "error" in html.lower() or "already" in html.lower()

    def test_post_edit_unknown_id_returns_404(self, client):
        """Should return 404 when editing a camera id that does not exist."""
        response = client.post("/admin/edit/99999", data={
            "name": "Ghost",
            "ip": "0.0.0.0",
            "rtsp_url": "rtsp://0.0.0.0/s",
            "username": "u",
            "password": "p",
        })
        assert response.status_code == 404


class TestAdminDelete:
    def test_post_delete_removes_camera_and_redirects(self, client, app):
        """Should delete the camera and redirect."""
        with app.app_context():
            from app.models.camera import Camera
            cam = Camera.create(name="DelMe", ip="10.0.0.1",
                                rtsp_url="rtsp://10.0.0.1/s",
                                username="u", password="p")
        response = client.post(f"/admin/delete/{cam['id']}", follow_redirects=False)
        assert response.status_code == 302
        with app.app_context():
            from app.models.camera import Camera
            assert Camera.get(cam["id"]) is None

    def test_post_delete_unknown_id_returns_404(self, client):
        """Should return 404 when deleting a camera id that does not exist."""
        response = client.post("/admin/delete/99999")
        assert response.status_code == 404
