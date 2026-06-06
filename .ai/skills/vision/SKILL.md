---
name: vision
description: "Analyze UI design images to extract layout, colors, typography, components, and interactions. Use whenever image files (.png, .jpg, .webp) are present alongside a UI task — mockups, screenshots, wireframes. Use during Architect Pre-PLAN Ritual, when ui-spec skill needs visual reference, or when implementing UI from design files."
---

# Vision — UI Analyzer

Extracts complete UI specification from design images.
Output feeds directly into SPEC (UX Flows), DESIGN.md (tokens, components), and implementation.

## Step 1 — Read the image

Pick the first available option:

**Option A — Ollama vision MCP** (if `vision-mcp-server-ollama` is in your MCP tools):
Use the MCP tool with the image path and the analysis prompt below.

**Option B — mmx-cli** (if installed):
Read `.ai/skills/mmx-vision/SKILL.md` and follow it.

**Option C — Native Read tool** (always available):
```
Read({ file_path: "path/to/image.png" })
```
Claude can view image files directly — no external tool needed. Then analyze using the prompt below.

## Analysis prompt

When analyzing the image, extract all of the following:

1. **LAYOUT MAP** — text-based spatial map: sections, columns, rows, what sits where (like a wireframe in text form).
2. **COMPONENTS** — for each: name, position (top/bottom/left/right/center), dimensions (full-width/half/quarter), background color, text color, border.
3. **COLOR PALETTE** — every color with role (background, text, accent, border) and approximate hex.
4. **TYPOGRAPHY** — font style (serif/sans), size (px), weight, color for each text level.
5. **IMAGES** — for each image/photo: what it shows, position, aspect ratio, dominant colors.
6. **INTERACTIVE ELEMENTS** — all clickable elements with visual style and label.
7. **COPY / TEXT CONTENT** — every piece of visible text verbatim — headlines, body copy, labels, buttons, nav items, footer. Preserve exact wording.

## Step 2 — Structure output

```
## UI Analysis: [filename]

### Layout Map
[HEADER: full-width]
  [LOGO left] ── [NAV center] ── [ICONS right]

[SECTION NAME: layout description]
  [LEFT col 45%]          [RIGHT col 55%]
  [component]             [component stack]

[FOOTER: full-width]
  [LOGO left] ── [LINKS center] ── [COPYRIGHT right]

### Color Palette
| Role | Hex | Usage |
|------|-----|-------|
| Primary bg | #... | page body |
| Accent | #... | buttons, icons |
| Primary text | #... | titles |

### Typography
| Level | Style | Size | Weight | Color |
|-------|-------|------|--------|-------|
| Display/Title | serif | ~48px | bold | #... |
| Body | sans | ~14px | regular | #... |

### Components
| Component | Position | Style | Colors |
|-----------|----------|-------|--------|
| Nav bar | top full-width | | bg: #..., text: #... |
| Primary CTA | right col | solid button | bg: #..., text: #... |

### Images
| Image | Position | Description | Aspect Ratio | Search terms |
|-------|----------|-------------|--------------|--------------|

### Interactive Elements → UX Flows
| Element | Label | Action |
|---------|-------|--------|

### Content / Copy
| Section | Element | Exact Text |
|---------|---------|------------|
```

## Step 3 — Save

Save structured output to `active/current/designs/[screen-name].md`.
Use image filename as screen name (e.g. `home.png` → `designs/home.md`).
Create `designs/` folder if it does not exist.

Multiple images: analyze each separately → one file per screen → add `designs/flow-map.md` connecting screens via interactive elements.

## Finding replacement images (optional)

If you need stock photos to replace images in the design, read `references/image-search.md`.
