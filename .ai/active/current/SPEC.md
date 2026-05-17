# SPEC: Camera Dashboard

**Status:** APPROVED
**Approved by:** user
**Date:** 2026-05-17

## Core Problem
A Flask dashboard to monitor multiple IP cameras (Imou + Yosee brands) from different vendors in a single grid view, with click-to-zoom into a single camera, running on a home network.

## Outcome
Home network users can view up to 10 IP cameras (Imou/Yosee) in a responsive grid, click to zoom to full-screen single view, and manage camera credentials via an admin panel — all served locally without external dependencies.

## Scope

### In Scope
- Camera credential CRUD (admin panel with form)
- MJPEG stream proxy (RTSP to browser via Flask)
- Responsive grid view (1-4 columns based on viewport)
- Single camera full-screen view with back button
- Bottom nav bar (grid/single view toggle, like Zoom/Meet)
- Stream failure placeholder ("Camera offline") with background auto-retry
- SQLite persistence for camera credentials
- Desktop (Chrome/Firefox/Safari), tablet, and iPhone support

### Out of Scope
- Audio streaming
- Video recording / playback
- Motion detection
- User authentication / access control (local network only)
- Remote access / DDNS
- More than 10 cameras
- Cloud integration

## Constraints

### Tech Stack
- Flask 3.x
- SQLite (stdlib `sqlite3`)
- OpenCV (`cv2`) 4.x for RTSP capture
- Vanilla JavaScript (no Vue/Vite/React)
- Server-side rendered HTML (Jinja2 templates)

### Performance / Runtime
- Each camera stream runs in its own background thread
- Max 10 concurrent streams
- Stream auto-retry every 30 seconds for offline cameras
- MJPEG output (multipart/x-mixed-replace) from Flask endpoints

### Browser Support
- Chrome 120+
- Firefox 120+
- Safari 17+
- iOS Safari 17+

### Security
- Local network only — no external exposure
- No authentication (trusted network assumption)
- Camera credentials stored in local SQLite (plaintext acceptable for v1)

## Edge Cases

| Case | Expected Behavior |
|------|-------------------|
| Camera offline at startup | Show "Camera offline" placeholder; background retry every 30s |
| Camera goes offline mid-stream | Detect failure, swap to placeholder, retry every 30s |
| Camera comes back online after offline | Status endpoint reports up; JS re-activates stream img src |
| Wrong credentials saved | Stream fails to open; show "Camera offline" placeholder |
| 11th camera added | Reject with form error: "Max 10 cameras allowed" |
| Duplicate camera name | Reject with form error: "Name must be unique" |
| Invalid RTSP URL format | Reject with form error on save |
| Delete camera while streaming | Stop background thread cleanly; remove from grid |
| Browser tab closed | Background threads continue (server-side); no leak per tab |
| Slow network on iPhone | MJPEG degrades gracefully; img tag handles partial frames |
| Click camera in grid | Navigate to full-screen single view for that camera |
| Press ESC in single view | Return to grid view |
| Press back button in single view | Return to grid view |
| Viewport < 600px | Grid renders 1 column |
| Viewport 600-900px | Grid renders 2 columns |
| Viewport 900-1200px | Grid renders 3 columns |
| Viewport > 1200px | Grid renders 4 columns |

## Acceptance Criteria

**AC1: Camera CRUD**
- Given the admin panel is open
- When user submits a valid camera form (name, IP, RTSP URL, username, password)
- Then the camera is persisted to SQLite and appears in the grid

**AC2: Grid View**
- Given cameras exist in the DB
- When user visits `/` (grid view)
- Then all cameras render as MJPEG `<img>` tiles in a responsive grid

**AC3: Stream Proxy**
- Given a camera with valid RTSP URL
- When the browser requests `/stream/<camera_id>`
- Then the Flask endpoint returns a multipart MJPEG stream from OpenCV capture

**AC4: Offline Placeholder**
- Given a camera's RTSP stream fails to open
- When the grid renders
- Then the tile shows a "Camera offline" placeholder image

**AC5: Auto-retry**
- Given a camera is offline
- When 30 seconds pass
- Then a background thread re-attempts the RTSP connection; on success the status endpoint reports up and JS re-activates the img src

**AC6: Single View Navigation**
- Given the user is on the grid view
- When the user clicks a camera tile
- Then the browser navigates to `/camera/<id>` showing that camera full-screen
- When the user presses ESC or the back button
- Then the browser returns to the grid view

**AC7: Bottom Nav Bar**
- Given the user is on any view
- Then a bottom nav bar is visible with grid/single view toggle controls

**AC8: Max 10 Cameras**
- Given 10 cameras exist
- When user attempts to add an 11th
- Then the form rejects with "Max 10 cameras allowed"

## UX Flows

### Flow 1: Add a camera
**Role:** home network user (admin)
**Entry point:** `/admin`

1. User opens `/admin`
   → Expected: Camera list table + "Add Camera" form (fields: name, IP, RTSP URL, username, password)

2. User fills the form and submits
   → Expected: Form validates; row added to camera list; success message shown

3. User navigates to `/`
   → Expected: New camera appears as a tile in the grid streaming live MJPEG

**Flow pass when:** all steps match expected, no manual URL editing required.
**Flow fail when:** any step redirects wrong, shows blank screen, or element does not respond.

### Flow 2: View all cameras in grid
**Role:** home network user
**Entry point:** `/`

1. User opens `/`
   → Expected: Responsive grid of camera tiles (1-4 cols based on viewport); each tile streams MJPEG; bottom nav bar visible

2. A camera is offline
   → Expected: That tile shows "Camera offline" placeholder; others continue streaming

3. Offline camera recovers (30s retry succeeds)
   → Expected: Tile automatically re-activates and streams

**Flow pass when:** all steps match expected, no manual URL editing required.
**Flow fail when:** any step redirects wrong, shows blank screen, or element does not respond.

### Flow 3: Zoom into a single camera
**Role:** home network user
**Entry point:** `/`

1. User clicks a camera tile in the grid
   → Expected: Browser navigates to `/camera/<id>`; camera renders full-screen; back button visible

2. User presses ESC key
   → Expected: Browser returns to `/` (grid view)

3. User clicks another tile, then presses browser back button
   → Expected: Browser returns to `/` (grid view)

**Flow pass when:** all steps match expected, no manual URL editing required.
**Flow fail when:** any step redirects wrong, shows blank screen, or element does not respond.

### Flow 4: Edit/Delete a camera
**Role:** home network user (admin)
**Entry point:** `/admin`

1. User clicks "Edit" on a camera row
   → Expected: Form pre-populates with that camera's values

2. User updates a field and submits
   → Expected: Camera updated in SQLite; stream restarts with new credentials

3. User clicks "Delete" on a camera row
   → Expected: Confirmation prompt; on confirm camera removed from DB; background thread stopped; tile removed from grid

**Flow pass when:** all steps match expected, no manual URL editing required.
**Flow fail when:** any step redirects wrong, shows blank screen, or element does not respond.
