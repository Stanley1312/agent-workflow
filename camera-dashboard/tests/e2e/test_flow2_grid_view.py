"""
Flow 2: View all cameras in the grid view.

SPEC UX Flow 2:
  1. User opens /
     → Expected: Responsive grid of camera tiles (1-4 cols based on viewport);
       each tile has an <img> src pointing to /stream/<id>; bottom nav bar visible.
  2. A camera is offline
     → Expected: That tile shows "Camera offline" placeholder; others continue.
  3. Offline camera recovers (30s retry succeeds)
     → Expected: Tile automatically re-activates and streams.
     (Note: auto-recovery is a background event — E2E coverage focuses on placeholder presence.)
"""
import pytest
from playwright.sync_api import expect


class TestFlow2GridView:
    """Flow 2: Responsive grid view with camera tiles."""

    def test_grid_page_loads_and_shows_camera_tile(self, page, seeded_camera):
        """
        should render a camera tile with an img element
        when a camera exists in the DB and the user visits /.
        Step 1 of Flow 2.
        """
        page.goto("/")
        expect(page).to_have_url("/")

        # At least one camera tile must be present
        tile = page.locator(".camera-tile").first
        expect(tile).to_be_visible()

        # The tile must contain an img with src pointing to /stream/<id>
        img = tile.locator("img")
        expect(img).to_be_visible()
        img_src = img.get_attribute("src")
        assert "/stream/" in img_src, f"Expected img src to contain /stream/, got: {img_src}"

    def test_grid_img_src_points_to_correct_stream_endpoint(self, page, seeded_camera):
        """
        should have img src set to /stream/<camera_id>
        for each camera tile rendered in the grid.
        Step 1 of Flow 2 (stream endpoint assertion).
        """
        page.goto("/")

        camera_id = seeded_camera["id"]
        img = page.locator(f"img[src='/stream/{camera_id}']")
        expect(img).to_be_visible()

    def test_bottom_nav_bar_is_visible_on_grid(self, page, seeded_camera):
        """
        should display the bottom navigation bar
        when the user is on the grid view.
        Step 1 of Flow 2 (nav bar assertion, AC7).
        """
        page.goto("/")
        nav = page.locator("nav, [class*='nav'], [id*='nav']").first
        expect(nav).to_be_visible()

    def test_empty_grid_template_contains_empty_state_element(self, page, app_instance):
        """
        should show an empty state message
        when no cameras exist in the DB.
        Boundary condition: empty camera list.
        Uses a fresh browser context with no prior cameras to avoid session state.
        """
        # Temporarily remove all cameras to simulate empty DB
        with app_instance.app_context():
            from app.models.camera import Camera
            all_cameras = Camera.list()
            for cam in all_cameras:
                Camera.delete(cam["id"])

        try:
            page.goto("/")
            # The template shows empty-state div when cameras list is empty
            empty = page.locator(".empty-state")
            expect(empty).to_be_visible()
        finally:
            # Restore cameras so other tests are not affected
            with app_instance.app_context():
                from app.models.camera import Camera
                for cam in all_cameras:
                    Camera.create(
                        name=cam["name"],
                        ip=cam["ip"],
                        rtsp_url=cam["rtsp_url"],
                        username=cam["username"],
                        password=cam.get("password", ""),
                    )

    def test_camera_tile_shows_camera_name(self, page, seeded_camera):
        """
        should display the camera name inside its tile
        when cameras exist in the DB and the grid is rendered.
        Step 1 of Flow 2 (tile label).
        """
        page.goto("/")
        expect(page.locator(".camera-name", has_text=seeded_camera["name"])).to_be_visible()

    def test_grid_renders_one_tile_per_camera(self, page, seeded_camera, app_instance):
        """
        should render exactly N camera tiles
        when N cameras exist in the DB.
        Step 1 of Flow 2 (tile count).
        """
        page.goto("/")

        with app_instance.app_context():
            from app.models.camera import Camera
            cameras = Camera.list()

        tiles = page.locator(".camera-tile")
        # There must be at least one tile and the count must match the DB
        expect(tiles.first).to_be_visible()
        assert tiles.count() == len(cameras), (
            f"Expected {len(cameras)} tiles, found {tiles.count()}"
        )

    def test_offline_camera_tile_is_still_present(self, page, seeded_camera):
        """
        should still render a tile with an img element for an offline camera
        (the img will show the placeholder served by the stream endpoint).
        Step 2 of Flow 2.
        """
        # We cannot easily kill RTSP in E2E, but the tile must always render
        # regardless of stream health (placeholder handled server-side).
        page.goto("/")
        camera_id = seeded_camera["id"]
        # The img tile must be present even when stream is unavailable (no real RTSP)
        img = page.locator(f"img[src='/stream/{camera_id}']")
        expect(img).to_be_visible()
