"""
Wave 4: Single Camera Full-Screen View — failing tests (RED state).

Tests cover:
- GET /camera/<id> returns 200 for a valid camera
- Response body contains <img src="/stream/<id>">
- Response body contains a back link to / (href="/")
- Response body contains ESC key handler (Escape or keydown)
- GET /camera/9999 returns 404 for an unknown camera id

Uses only stdlib HTML parsing (html.parser) — no bs4 dependency.
"""
import pytest
from html.parser import HTMLParser


# ---------------------------------------------------------------------------
# Minimal HTML parser helpers (stdlib only, copied from test_grid_route.py)
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
# Test 1: GET /camera/<id> returns 200 for a valid camera
# ---------------------------------------------------------------------------

def test_single_view_valid_camera_returns_200(app, client):
    """GET /camera/<id> must return HTTP 200 for a camera that exists in the DB."""
    cam = _insert_camera(app, "Cam Front")
    response = client.get(f"/camera/{cam['id']}")
    assert response.status_code == 200, (
        f"Expected 200 for /camera/{cam['id']}, got {response.status_code}"
    )


# ---------------------------------------------------------------------------
# Test 2: Response body contains <img src="/stream/<id>">
# ---------------------------------------------------------------------------

def test_single_view_contains_stream_img(app, client):
    """GET /camera/<id> response must include <img src="/stream/<id>">."""
    cam = _insert_camera(app, "Cam Garden")
    response = client.get(f"/camera/{cam['id']}")
    assert response.status_code == 200

    parsed = _parse(response.data)
    imgs = parsed.find_all("img")

    expected_src = f"/stream/{cam['id']}"
    stream_imgs = [img for img in imgs if img.get("src", "") == expected_src]

    assert len(stream_imgs) >= 1, (
        f"Expected at least one <img src=\"{expected_src}\"> in the response, "
        f"but found none. img srcs found: {[img.get('src') for img in imgs]}"
    )


# ---------------------------------------------------------------------------
# Test 3: Response body contains a back link to /
# ---------------------------------------------------------------------------

def test_single_view_contains_back_link(app, client):
    """GET /camera/<id> response must include a link back to / (href=\"/\")."""
    cam = _insert_camera(app, "Cam Porch")
    response = client.get(f"/camera/{cam['id']}")
    assert response.status_code == 200

    body_text = response.data.decode("utf-8")

    assert 'href="/"' in body_text or "href='/'" in body_text, (
        "Expected a back link with href=\"/\" in the single camera view response, "
        "but none was found."
    )


# ---------------------------------------------------------------------------
# Test 4: Response body contains ESC key handler
# ---------------------------------------------------------------------------

def test_single_view_contains_esc_handler(app, client):
    """GET /camera/<id> response must include an ESC key handler (Escape or keydown)."""
    cam = _insert_camera(app, "Cam Garage")
    response = client.get(f"/camera/{cam['id']}")
    assert response.status_code == 200

    body_text = response.data.decode("utf-8")

    has_escape = "Escape" in body_text
    has_keydown = "keydown" in body_text

    assert has_escape or has_keydown, (
        "Expected ESC key handler (containing 'Escape' or 'keydown') in the "
        "single camera view response, but neither was found."
    )


# ---------------------------------------------------------------------------
# Test 5: GET /camera/9999 returns 404 for an unknown camera id
# ---------------------------------------------------------------------------

def test_single_view_unknown_id_returns_404(client):
    """GET /camera/9999 must return HTTP 404 when the camera does not exist."""
    response = client.get("/camera/9999")
    assert response.status_code == 404, (
        f"Expected 404 for /camera/9999 (unknown id), got {response.status_code}"
    )
