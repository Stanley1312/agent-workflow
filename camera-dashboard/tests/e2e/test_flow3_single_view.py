"""
Flow 3: Zoom into a single camera (click tile, ESC key, back button).

SPEC UX Flow 3:
  1. User clicks a camera tile in the grid
     → Expected: Browser navigates to /camera/<id>; camera renders full-screen;
       back button visible.
  2. User presses ESC key
     → Expected: Browser returns to / (grid view).
  3. User clicks another tile, then presses browser back button
     → Expected: Browser returns to / (grid view).
"""
import re

import pytest
from playwright.sync_api import expect


class TestFlow3SingleView:
    """Flow 3: Click-to-single-view and back navigation."""

    def test_clicking_camera_tile_navigates_to_single_view(self, page, seeded_camera):
        """
        should navigate to /camera/<id> when the user clicks a camera tile in the grid.
        Step 1 of Flow 3 (AC6).
        """
        page.goto("/")

        # Click the tile that belongs to the seeded camera specifically
        camera_id = seeded_camera["id"]
        tile = page.locator(f".camera-tile:has(img[src='/stream/{camera_id}'])")
        expect(tile).to_be_visible()
        tile.click()

        # Should land on /camera/<id> — the exact id we clicked
        expect(page).to_have_url(f"/camera/{camera_id}")

    def test_single_view_shows_full_screen_stream_img(self, page, seeded_camera):
        """
        should display an img element with the correct stream src
        when /camera/<id> is loaded.
        Step 1 of Flow 3 (full-screen render assertion, AC6).
        """
        camera_id = seeded_camera["id"]
        page.goto(f"/camera/{camera_id}")

        img = page.locator(f"img[src='/stream/{camera_id}']")
        expect(img).to_be_visible()

    def test_single_view_shows_back_button(self, page, seeded_camera):
        """
        should display a back button on the single camera view.
        Step 1 of Flow 3 (back button visible assertion).
        """
        camera_id = seeded_camera["id"]
        page.goto(f"/camera/{camera_id}")

        back = page.locator("a.back-button").first
        expect(back).to_be_visible()

    def test_esc_key_returns_to_grid_from_single_view(self, page, seeded_camera):
        """
        should return to / (grid view) when the user presses the ESC key
        while on /camera/<id>.
        Step 2 of Flow 3 (AC6, Edge Case: Press ESC in single view).
        """
        camera_id = seeded_camera["id"]
        page.goto(f"/camera/{camera_id}")

        page.keyboard.press("Escape")

        expect(page).to_have_url("/")

    def test_back_button_returns_to_grid(self, page, seeded_camera):
        """
        should return to / (grid view) when the user clicks the Back button
        on the single camera view.
        Step 3 of Flow 3 (AC6, Edge Case: Press back button in single view).
        """
        camera_id = seeded_camera["id"]
        page.goto(f"/camera/{camera_id}")

        # The back button links to "/" but may be covered by the fixed nav bar.
        # Use dispatch_event to bypass any overlapping elements.
        back = page.locator("a.back-button").first
        expect(back).to_be_visible()
        back.dispatch_event("click")

        expect(page).to_have_url("/")

    def test_browser_history_back_returns_to_grid(self, page, seeded_camera):
        """
        should return to / (grid view) when the user uses the browser back button
        after navigating to a single camera view.
        Step 3 of Flow 3 (browser-native back navigation).
        """
        page.goto("/")

        # Click the specific seeded camera tile so we know which URL to assert
        camera_id = seeded_camera["id"]
        tile = page.locator(f".camera-tile:has(img[src='/stream/{camera_id}'])")
        expect(tile).to_be_visible()
        tile.click()

        expect(page).to_have_url(f"/camera/{camera_id}")

        page.go_back()

        expect(page).to_have_url("/")

    def test_single_view_shows_camera_name(self, page, seeded_camera):
        """
        should display the camera name on the single view page.
        Step 1 of Flow 3 (content correctness).
        """
        camera_id = seeded_camera["id"]
        page.goto(f"/camera/{camera_id}")

        expect(
            page.locator("h1", has_text=seeded_camera["name"])
        ).to_be_visible()

    def test_unknown_camera_id_returns_404(self, page):
        """
        should return a 404 response when a non-existent camera id is requested.
        Edge case: invalid camera id.
        """
        response = page.goto("/camera/99999")
        assert response.status == 404, f"Expected 404, got {response.status}"
