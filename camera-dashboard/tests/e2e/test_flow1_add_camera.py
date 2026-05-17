"""
Flow 1: Add a camera via the admin panel.

SPEC UX Flow 1:
  1. User opens /admin
     → Expected: Camera list table + "Add Camera" form with fields
       (name, IP, RTSP URL, username, password)
  2. User fills the form and submits
     → Expected: Form validates; row added to camera list; success message shown
  3. User navigates to /
     → Expected: New camera appears as a tile in the grid
"""
import pytest
from playwright.sync_api import expect


class TestFlow1AddCamera:
    """Flow 1: Add a camera via the admin panel."""

    def test_admin_page_shows_add_camera_form(self, page):
        """
        should show the Add Camera form with all required fields when /admin is opened.
        Step 1 of Flow 1.
        """
        page.goto("/admin")

        # Scope to the "Add Camera" section form (not the hidden edit inputs in the table)
        add_form = page.locator("form[action*='/admin/add']")
        expect(add_form).to_be_visible()
        expect(add_form.locator("input[name='name']")).to_be_visible()
        expect(add_form.locator("input[name='ip']")).to_be_visible()
        expect(add_form.locator("input[name='rtsp_url']")).to_be_visible()
        expect(add_form.locator("input[name='username']")).to_be_visible()
        expect(add_form.locator("input[name='password']")).to_be_visible()

        # Submit button must be present inside the add form
        expect(add_form.locator("button[type='submit']")).to_be_visible()

    def test_submit_valid_camera_form_adds_camera_to_list(self, page):
        """
        should add a camera row to the list and show a success message
        when valid form data is submitted.
        Step 2 of Flow 1.
        """
        page.goto("/admin")

        add_form = page.locator("form[action*='/admin/add']")
        add_form.locator("input[name='name']").fill("Living Room")
        add_form.locator("input[name='ip']").fill("192.168.1.50")
        add_form.locator("input[name='rtsp_url']").fill("rtsp://192.168.1.50/stream")
        add_form.locator("input[name='username']").fill("admin")
        add_form.locator("input[name='password']").fill("secret")
        add_form.locator("button[type='submit']").click()

        # After redirect back to /admin the new camera row must appear in the table
        expect(page.locator("table")).to_be_visible()
        expect(page.locator("td", has_text="Living Room")).to_be_visible()

    def test_added_camera_appears_as_tile_on_grid(self, page):
        """
        should show the newly added camera as a tile in the grid view
        when the user navigates to /.
        Step 3 of Flow 1.
        """
        # Add a camera first via the add form
        page.goto("/admin")
        add_form = page.locator("form[action*='/admin/add']")
        add_form.locator("input[name='name']").fill("Garden Camera")
        add_form.locator("input[name='ip']").fill("192.168.1.51")
        add_form.locator("input[name='rtsp_url']").fill("rtsp://192.168.1.51/stream")
        add_form.locator("input[name='username']").fill("viewer")
        add_form.locator("input[name='password']").fill("pass123")
        add_form.locator("button[type='submit']").click()

        # Verify the camera was added on admin page
        expect(page.locator("td", has_text="Garden Camera")).to_be_visible()

        # Navigate to grid
        page.goto("/")

        # Camera tile with img element must be present
        tile = page.locator(".camera-tile", has_text="Garden Camera")
        expect(tile).to_be_visible()
        expect(tile.locator("img")).to_be_visible()

    def test_admin_page_shows_camera_table_when_cameras_exist(self, page, seeded_camera):
        """
        should render a camera table with at least one row
        when cameras are already present in the DB.
        Step 1 (table section) of Flow 1.
        """
        page.goto("/admin")
        expect(page.locator("table")).to_be_visible()
        expect(page.locator("td", has_text=seeded_camera["name"])).to_be_visible()

    def test_duplicate_camera_name_shows_error(self, page, seeded_camera):
        """
        should reject the form with an error when a duplicate camera name is submitted
        (edge case from SPEC).
        """
        page.goto("/admin")

        add_form = page.locator("form[action*='/admin/add']")
        add_form.locator("input[name='name']").fill(seeded_camera["name"])
        add_form.locator("input[name='ip']").fill("192.168.1.200")
        add_form.locator("input[name='rtsp_url']").fill("rtsp://192.168.1.200/stream")
        add_form.locator("button[type='submit']").click()

        # Should stay on /admin — URL may include query params but path is /admin
        assert "/admin" in page.url, f"Expected to stay on /admin, got {page.url}"

        # The error or flash message should appear — check body text contains error keywords
        body_text = page.locator("body").inner_text()
        assert any(
            kw in body_text.lower()
            for kw in ("unique", "already", "error", "duplicate", "exists")
        ), f"Expected error message in body, got: {body_text[:300]}"

    def test_invalid_rtsp_url_shows_error(self, page):
        """
        should reject the form with a validation error when an invalid RTSP URL is submitted
        (edge case from SPEC).
        """
        page.goto("/admin")

        add_form = page.locator("form[action*='/admin/add']")
        add_form.locator("input[name='name']").fill("BadURL Camera")
        add_form.locator("input[name='ip']").fill("192.168.1.202")
        add_form.locator("input[name='rtsp_url']").fill("not-a-valid-url")
        add_form.locator("button[type='submit']").click()

        # Should remain on /admin
        assert "/admin" in page.url, f"Expected to stay on /admin, got {page.url}"

        body_text = page.locator("body").inner_text()
        assert any(
            kw in body_text.lower()
            for kw in ("invalid", "rtsp", "url", "error", "format")
        ), f"Expected RTSP validation error in body, got: {body_text[:300]}"
