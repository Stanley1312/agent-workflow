"""
Wave 4: Grid Click Navigation — failing tests (RED state).

Tests cover:
- GET / response body contains the string '/camera/' as a navigation target,
  confirming that grid tiles include click handlers that navigate to /camera/<id>.
"""
import pytest


# ---------------------------------------------------------------------------
# Test 1: GET / response body contains /camera/ for click-based navigation
# ---------------------------------------------------------------------------

def test_grid_contains_camera_navigation_target(app, client):
    """GET / response must reference '/camera/' so click handlers can navigate
    to the single camera full-screen view at /camera/<id>."""
    from app.models.camera import Camera
    with app.app_context():
        Camera.create(name="Nav Test Cam", ip="192.168.1.1",
                      rtsp_url="rtsp://192.168.1.1/live", username="u", password="p")

    response = client.get("/")
    assert response.status_code == 200

    body_text = response.data.decode("utf-8")

    assert "/camera/" in body_text, (
        "Expected the string '/camera/' to appear in the grid view response body "
        "as a navigation target for tile click handlers, but it was not found."
    )
