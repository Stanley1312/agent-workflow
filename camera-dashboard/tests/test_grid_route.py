"""
Wave 3: Responsive Grid View — failing tests (RED state).

Tests cover:
- GET / returns 200
- Response contains one <img> per camera with src="/stream/<id>"
- Response contains a bottom nav bar with links to / and /admin
- Empty state message when no cameras exist
- app/static/css/grid.css exists and contains @media breakpoints

Uses only stdlib HTML parsing (html.parser) — no bs4 dependency.
"""
import os
import re
import pytest
from html.parser import HTMLParser


# ---------------------------------------------------------------------------
# Minimal HTML parser helpers (stdlib only)
# ---------------------------------------------------------------------------

class _TagCollector(HTMLParser):
    """Collect all tags and their attributes from an HTML document."""

    def __init__(self):
        super().__init__()
        self.tags = []  # list of (tag_name, attrs_dict) tuples

    def handle_starttag(self, tag: str, attrs):
        self.tags.append((tag, dict(attrs)))

    def find_all(self, tag: str) -> list:
        return [attrs for t, attrs in self.tags if t == tag]

    def find_first(self, tag: str):
        results = self.find_all(tag)
        return results[0] if results else None


def _parse(html: bytes) -> _TagCollector:
    collector = _TagCollector()
    collector.feed(html.decode("utf-8"))
    return collector


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _insert_camera(app, name, rtsp_url="rtsp://192.168.1.10/live"):
    """Insert a minimal camera row directly via the model layer."""
    from app.models.camera import Camera
    with app.app_context():
        return Camera.create(
            name=name,
            ip="192.168.1.10",
            rtsp_url=rtsp_url,
            username="admin",
            password="pass",
        )


# ---------------------------------------------------------------------------
# Test 1: GET / with no cameras returns 200
# ---------------------------------------------------------------------------

def test_grid_no_cameras_returns_200(client):
    """GET / must return HTTP 200 even when no cameras are in the DB."""
    response = client.get("/")
    assert response.status_code == 200


# ---------------------------------------------------------------------------
# Test 2: GET / with 2 cameras contains exactly 2 <img> tags
# ---------------------------------------------------------------------------

def test_grid_contains_one_img_per_camera(app, client):
    """GET / must contain exactly one <img src="/stream/<id>"> per camera."""
    cam1 = _insert_camera(app, "Cam Front")
    cam2 = _insert_camera(app, "Cam Back")

    response = client.get("/")
    assert response.status_code == 200

    parsed = _parse(response.data)
    imgs = parsed.find_all("img")

    stream_imgs = [img for img in imgs if img.get("src", "").startswith("/stream/")]
    stream_srcs = [img["src"] for img in stream_imgs]

    assert len(stream_srcs) == 2, (
        f"Expected 2 stream <img> tags, got {len(stream_srcs)}: {stream_srcs}"
    )

    expected_srcs = {f"/stream/{cam1['id']}", f"/stream/{cam2['id']}"}
    assert set(stream_srcs) == expected_srcs, (
        f"Expected srcs {expected_srcs}, found {set(stream_srcs)}"
    )


# ---------------------------------------------------------------------------
# Test 3: GET / response contains a bottom nav bar with / and /admin links
# ---------------------------------------------------------------------------

def test_grid_contains_nav_bar(client):
    """GET / must include a nav bar element with links to / and /admin."""
    response = client.get("/")
    assert response.status_code == 200

    parsed = _parse(response.data)
    body_text = response.data.decode("utf-8")

    # A <nav> tag must be present
    nav_tags = parsed.find_all("nav")
    assert len(nav_tags) > 0, (
        "Expected at least one <nav> element in the response"
    )

    # The nav must link to the admin panel
    assert "/admin" in body_text, "Expected a link to /admin in the response"

    # The nav must link back to grid (/)
    has_root_link = bool(re.search(r'href=["\']/?["\']', body_text))
    assert has_root_link, "Expected a link to / (grid view) in the response"


# ---------------------------------------------------------------------------
# Test 4: GET / with 0 cameras shows an empty-state indicator
# ---------------------------------------------------------------------------

def test_grid_empty_state_message(client):
    """GET / with no cameras must show an empty-state message or link to /admin."""
    response = client.get("/")
    assert response.status_code == 200

    body_text = response.data.decode("utf-8").lower()

    has_empty_message = "no camera" in body_text
    has_admin_link = "/admin" in body_text

    assert has_empty_message or has_admin_link, (
        "Expected an empty-state message ('no cameras') or a link to /admin "
        "when no cameras exist"
    )


# ---------------------------------------------------------------------------
# Test 5: app/static/css/grid.css exists and contains @media breakpoints
# ---------------------------------------------------------------------------

def test_grid_css_file_exists_with_media_queries():
    """app/static/css/grid.css must exist and contain @media breakpoints."""
    css_path = os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            "..",
            "app", "static", "css", "grid.css",
        )
    )

    assert os.path.isfile(css_path), (
        f"Expected CSS file at {css_path} but it does not exist"
    )

    with open(css_path, "r") as fh:
        css_content = fh.read()

    assert "@media" in css_content, (
        "Expected at least one @media rule in app/static/css/grid.css for "
        "responsive column breakpoints"
    )

    media_count = css_content.count("@media")
    assert media_count >= 3, (
        f"Expected at least 3 @media breakpoints for 1/2/3/4 column layout, "
        f"found {media_count}"
    )
