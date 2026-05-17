# PLAN: Camera Dashboard

Chain of truth: SPEC → PLAN → Tests → Code.
Each wave is independently testable. Re-runs are scoped to the affected wave.

---

## Wave 1: Scaffold + DB + Camera CRUD

**Goal:** Flask app skeleton, SQLite schema, and full camera CRUD (admin panel) with validation (max 10, unique name, RTSP URL format).

**Dependencies:** none

**Files touched:**
- `app/__init__.py` — Flask app factory
- `app/db.py` — SQLite connection + schema init
- `app/models/camera.py` — Camera model + CRUD functions
- `app/routes/admin.py` — `/admin` GET/POST routes (list, add, edit, delete)
- `app/templates/admin.html` — admin panel template
- `app/templates/base.html` — shared layout (bottom nav bar shell)
- `app/static/css/main.css` — base styles
- `schema.sql` — camera table DDL
- `run.py` — dev entrypoint
- `requirements.txt` — flask, opencv-python
- `tests/test_db.py` — schema init test
- `tests/test_camera_crud.py` — CRUD + validation tests
- `tests/test_admin_routes.py` — route-level tests (form rendering, POST handling)

**Tasks:**
1. (Tester) Write failing tests for: DB init, Camera.create / get / list / update / delete, max-10 validation, unique name, invalid RTSP URL rejection, admin GET renders form, admin POST creates camera.
2. (Implementor) Implement DB layer, model, routes, templates until GREEN.

**Acceptance:** AC1, AC8.

---

## Wave 2: RTSP-to-MJPEG Stream Proxy

**Goal:** Background thread per camera captures RTSP via OpenCV; Flask endpoint streams MJPEG (multipart/x-mixed-replace). Failure detection produces "Camera offline" placeholder.

**Dependencies:** Wave 1 GREEN (cameras exist in DB to stream)

**Files touched:**
- `app/streams/manager.py` — StreamManager: dict of camera_id -> StreamWorker, lifecycle (start, stop, restart)
- `app/streams/worker.py` — StreamWorker: background thread, cv2.VideoCapture, JPEG encode, frame buffer, offline flag
- `app/streams/placeholder.py` — generates "Camera offline" JPEG once at startup
- `app/routes/stream.py` — `/stream/<camera_id>` MJPEG endpoint
- `app/__init__.py` — wire StreamManager into app context; start workers on boot for all DB cameras
- `tests/test_stream_worker.py` — capture loop, offline detection (mock cv2.VideoCapture)
- `tests/test_stream_manager.py` — start/stop/restart lifecycle
- `tests/test_stream_route.py` — `/stream/<id>` returns multipart MJPEG content-type; offline camera returns placeholder

**Tasks:**
1. (Tester) Write failing tests (mock `cv2.VideoCapture` so no real RTSP needed): worker captures frames, worker flips offline when capture.read() fails N times, manager.start/stop, route returns multipart/x-mixed-replace.
2. (Implementor) Build manager, worker, placeholder, route until GREEN.

**Acceptance:** AC3, AC4.

---

## Wave 3: Responsive Grid View

**Goal:** `/` renders all cameras as MJPEG `<img>` tiles in a responsive grid (1-4 columns based on viewport). Bottom nav bar visible.

**Dependencies:** Wave 2 GREEN (stream endpoint must exist)

**Files touched:**
- `app/routes/views.py` — `/` grid route
- `app/templates/grid.html` — grid layout with `<img src="/stream/<id>">` tiles
- `app/templates/_nav.html` — bottom nav bar partial
- `app/static/css/grid.css` — CSS grid with media queries (1/2/3/4 col breakpoints)
- `tests/test_grid_route.py` — route renders, contains one img per camera, contains nav bar

**Tasks:**
1. (Tester) Write failing tests: GET `/` returns 200; contains one `<img>` per camera with src `/stream/<id>`; includes bottom nav bar; CSS file references correct breakpoints.
2. (Implementor) Build grid template + CSS until GREEN.

**Acceptance:** AC2, AC7 (partial — nav bar present).

---

## Wave 4: Single Camera Full-Screen View

**Goal:** `/camera/<id>` shows one camera full-screen with back button. Click on grid tile navigates here. ESC key returns to grid.

**Dependencies:** Wave 3 GREEN

**Files touched:**
- `app/routes/views.py` — add `/camera/<id>` route
- `app/templates/single.html` — full-screen single view template
- `app/static/js/single.js` — ESC key handler -> navigate back to `/`
- `app/static/js/grid.js` — click handler on tiles -> navigate to `/camera/<id>`
- `app/static/css/single.css` — full-screen layout
- `tests/test_single_route.py` — route renders 200 for valid camera, 404 for unknown
- `tests/test_grid_click.py` — grid template includes click handler that targets `/camera/<id>`

**Tasks:**
1. (Tester) Write failing tests: `/camera/<id>` returns 200 and contains img with correct stream src; unknown id returns 404; grid template includes navigation JS referencing `/camera/<id>`; single template includes ESC handler.
2. (Implementor) Build single view route, template, JS until GREEN.

**Acceptance:** AC6, AC7 (full nav bar toggle behavior).

---

## Wave 5: Stream Auto-Retry

**Goal:** Background retry loop re-attempts offline cameras every 30s. `/status` endpoint reports per-camera up/down. Grid JS polls `/status` and re-activates img src for cameras that came back online.

**Dependencies:** Wave 2 GREEN (worker offline flag exists), Wave 3 GREEN (grid is what polls)

**Files touched:**
- `app/streams/manager.py` — add retry loop thread; iterates offline workers every 30s and calls worker.restart()
- `app/streams/worker.py` — add `is_online()` accessor
- `app/routes/status.py` — `/status` JSON endpoint -> `{camera_id: "up"|"down"}`
- `app/static/js/grid.js` — poll `/status` every 5s; for cameras transitioning down->up, force `img.src` reload with cache-buster
- `tests/test_status_route.py` — `/status` returns correct JSON for mixed up/down workers
- `tests/test_retry_loop.py` — retry thread re-invokes restart on offline workers after interval (use injected short interval for test)

**Tasks:**
1. (Tester) Write failing tests: `/status` returns JSON with one entry per camera; retry loop calls restart() on offline worker; online worker not restarted.
2. (Implementor) Implement retry thread, status route, grid polling JS until GREEN.

**Acceptance:** AC5.

---

## Wave 6: UI/E2E (Playwright)

**Goal:** End-to-end Playwright tests covering all UX Flows in SPEC. Final visual / interaction validation. Polish styling.

**Dependencies:** Waves 1-5 GREEN

**Files touched:**
- `tests/e2e/test_flow1_add_camera.py` — Flow 1: Add a camera
- `tests/e2e/test_flow2_grid_view.py` — Flow 2: Grid view + offline placeholder + recovery
- `tests/e2e/test_flow3_single_view.py` — Flow 3: Zoom into single camera (click, ESC, back button)
- `tests/e2e/test_flow4_edit_delete.py` — Flow 4: Edit and Delete a camera
- `tests/e2e/conftest.py` — Playwright fixtures, Flask test server, fake RTSP source
- `app/templates/*` — UI polish as needed
- `app/static/css/*` — visual polish

**Tasks:**
1. (Tester) Write failing Playwright tests for all 4 UX Flows in SPEC.
2. (Implementor) Adjust templates / CSS / JS until all flows pass GREEN.

**Acceptance:** All UX Flows pass; all ACs validated end-to-end.

---

## Wave Isolation Notes
- Wave 1 has no runtime dependency on cv2; pure Flask + SQLite.
- Wave 2 mocks `cv2.VideoCapture` in unit tests — no real RTSP source required until Wave 6.
- Wave 3 can be tested independently of stream content (only checks route + template structure).
- Wave 4 depends on Wave 3 templates but adds isolated single view.
- Wave 5 changes are additive — does not modify existing stream worker capture logic.
- Wave 6 is the only wave needing a real or simulated RTSP source.
