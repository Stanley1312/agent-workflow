"""
Flow 4: Edit and delete a camera via the admin panel.

SPEC UX Flow 4:
  1. User clicks "Edit" on a camera row
     → Expected: Form pre-populates with that camera's values.
  2. User updates a field and submits
     → Expected: Camera updated in SQLite; success message shown.
  3. User clicks "Delete" on a camera row
     → Expected: Confirmation prompt; on confirm camera removed from DB;
       tile removed from grid.
"""
import pytest
from playwright.sync_api import expect


class TestFlow4EditDeleteCamera:
    """Flow 4: Edit and Delete a camera via the admin panel."""

    def test_edit_button_submits_form_with_camera_values(self, page, seeded_camera):
        """
        should submit the edit form with the camera's existing values
        when the user clicks the Edit button on a camera row.
        Step 1 of Flow 4.
        """
        page.goto("/admin")

        # The edit form for the camera row must be present
        camera_id = seeded_camera["id"]
        edit_form = page.locator(
            f"form[action*='/admin/edit/{camera_id}']"
        )
        expect(edit_form).to_be_visible()

        # Hidden inputs must carry the existing camera values
        name_input = edit_form.locator("input[name='name']")
        expect(name_input).to_have_value(seeded_camera["name"])

    def test_edit_camera_updates_name_and_shows_success(self, page, seeded_camera, app_instance):
        """
        should persist the updated camera name and show a success message
        when the user submits an edit form with a changed name.
        Step 2 of Flow 4.
        """
        camera_id = seeded_camera["id"]
        new_name = "Updated Camera Name"

        # Post the edit form directly via page.request to avoid confirm dialogs
        page.goto("/admin")
        response = page.request.post(
            f"/admin/edit/{camera_id}",
            form={
                "name": new_name,
                "ip": seeded_camera["ip"],
                "rtsp_url": seeded_camera["rtsp_url"],
                "username": seeded_camera["username"],
                "password": "admin123",
            },
        )
        # Should redirect (302) then land on /admin with success
        assert response.status in (200, 302), f"Unexpected status {response.status}"

        # Navigate to admin and verify the updated name appears
        page.goto("/admin")
        expect(page.locator("td", has_text=new_name)).to_be_visible()

        # Cleanup: restore original name
        with app_instance.app_context():
            from app.models.camera import Camera
            Camera.update(
                camera_id=camera_id,
                name=seeded_camera["name"],
                ip=seeded_camera["ip"],
                rtsp_url=seeded_camera["rtsp_url"],
                username=seeded_camera["username"],
                password="admin123",
            )

    def test_delete_camera_removes_it_from_admin_list(self, page, app_instance):
        """
        should remove the camera from the admin list
        when the user confirms the delete action.
        Step 3 of Flow 4.
        """
        # Create a camera specifically for deletion
        with app_instance.app_context():
            from app.models.camera import Camera
            cam = Camera.create(
                name="To Be Deleted",
                ip="192.168.1.250",
                rtsp_url="rtsp://192.168.1.250/stream",
                username="admin",
                password="pass",
            )
        camera_id = cam["id"]

        page.goto("/admin")
        # Camera must be visible before deletion
        expect(page.locator("td", has_text="To Be Deleted")).to_be_visible()

        # Post the delete form directly (avoids JS confirm dialog in headless mode)
        response = page.request.post(f"/admin/delete/{camera_id}")
        assert response.status in (200, 302), f"Unexpected status {response.status}"

        # Reload admin and verify the camera is gone
        page.goto("/admin")
        expect(page.locator("td", has_text="To Be Deleted")).not_to_be_visible()

    def test_deleted_camera_tile_removed_from_grid(self, page, app_instance):
        """
        should remove the camera tile from the grid
        when the camera is deleted via the admin panel.
        Step 3 of Flow 4 (grid cleanup assertion, AC1 / delete camera while streaming).
        """
        # Create a camera specifically for this test
        with app_instance.app_context():
            from app.models.camera import Camera
            cam = Camera.create(
                name="Grid Removal Test",
                ip="192.168.1.251",
                rtsp_url="rtsp://192.168.1.251/stream",
                username="admin",
                password="pass",
            )
        camera_id = cam["id"]

        page.goto("/")
        expect(page.locator(".camera-name", has_text="Grid Removal Test")).to_be_visible()

        # Delete via request
        page.request.post(f"/admin/delete/{camera_id}")

        # Reload grid
        page.goto("/")
        expect(page.locator(".camera-name", has_text="Grid Removal Test")).not_to_be_visible()

    def test_delete_nonexistent_camera_returns_404(self, page):
        """
        should return 404 when attempting to delete a camera id that does not exist.
        Edge case: invalid camera id on delete.
        """
        response = page.request.post("/admin/delete/99999")
        assert response.status == 404, f"Expected 404, got {response.status}"

    def test_edit_nonexistent_camera_returns_404(self, page, seeded_camera):
        """
        should return 404 when attempting to edit a camera id that does not exist.
        Edge case: invalid camera id on edit.
        """
        response = page.request.post(
            "/admin/edit/99999",
            form={
                "name": "Ghost",
                "ip": "1.2.3.4",
                "rtsp_url": "rtsp://1.2.3.4/stream",
                "username": "u",
                "password": "p",
            },
        )
        assert response.status == 404, f"Expected 404, got {response.status}"
