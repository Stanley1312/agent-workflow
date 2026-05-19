---
name: mmx-vision
description: "Analyze UI design images using Minimax VLM to extract layout, colors, typography, components, and interactions. Invoke whenever image files (.png, .jpg, .webp) are present alongside a UI task — mockups, screenshots, wireframes. Use during Architect Pre-SPEC Ritual, when ui-spec skill needs visual reference, or when implementing UI from design files. Requires mmx-cli installed and authenticated."
---

# Minimax Vision — UI Analyzer

Extracts complete UI specification from design images via Minimax VLM.
Output feeds directly into SPEC (UX Flows), DESIGN.md (tokens, components), and implementation.

## Command
```bash
mmx vision describe <image-path> --prompt "<prompt>"
```

## Prompt (use exactly as-is)
```
Analyze this UI design in detail. Please provide:

1. LAYOUT MAP: Draw a text-based spatial map showing the page structure — sections, columns, rows, and what sits where (like a wireframe in text form).

2. COMPONENTS: For each component, describe: name, position (top/bottom/left/right/center, which section), dimensions (full-width/half/quarter, approximate height), background color, text color, border.

3. COLOR PALETTE: List every color with its role (background, text, accent, border) and approximate hex or description.

4. TYPOGRAPHY: Font style (serif/sans), size (xl/lg/md/sm or px), weight, color for each text level.

5. IMAGES: For each image/photo in the design, describe what it shows, its position, aspect ratio, and dominant colors.

6. INTERACTIVE ELEMENTS: All clickable elements with their visual style and label.
```

## Step 1 — Run for each image
```bash
mmx vision describe path/to/screen.png --prompt "Analyze this UI design in detail. Please provide: 1. LAYOUT MAP: Draw a text-based spatial map showing the page structure — sections, columns, rows, and what sits where. 2. COMPONENTS: For each component: name, position, dimensions, background color, text color, border. 3. COLOR PALETTE: Every color with role and approximate hex. 4. TYPOGRAPHY: Font style, size (px if possible), weight, color for each text level. 5. IMAGES: For each image/photo: what it shows, position, aspect ratio, dominant colors. 6. INTERACTIVE ELEMENTS: All clickable elements with visual style and label."
```

## Step 2 — Structure for Architect

Organize VLM output into:

---
## UI Analysis: [filename]

### Layout Map
```
[HEADER: full-width]
  [LOGO left] ── [NAV center] ── [ICONS right]

[SECTION NAME: layout description]
  [LEFT col 45%]          [RIGHT col 55%]
  [component]             [component stack]

[SECTION NAME: full-width]
  [col 1/3] [col 1/3] [col 1/3]

[FOOTER: full-width]
  [LOGO left] ── [LINKS center] ── [COPYRIGHT right]
```

### Color Palette
| Role | Hex | Usage |
|------|-----|-------|
| Primary bg | #... | page body |
| Accent | #... | buttons, icons, price |
| Primary text | #... | titles |
| Secondary text | #... | labels, subtitles |
| Body text | #... | descriptions |

### Typography
| Level | Style | Size | Weight | Color |
|-------|-------|------|--------|-------|
| Display/Title | serif | ~48px | bold | #... |
| Price | serif | ~32px | bold | #... |
| Body | sans | ~14px | regular | #... |
| Label | sans uppercase | ~11px | bold | #... |

### Components
| Component | Position | Style | Colors |
|-----------|----------|-------|--------|
| Nav bar | top full-width | | bg: #..., text: #... |
| Primary CTA | right col | solid button | bg: #..., text: #... |
| Secondary CTA | right col | ghost button | border: #..., text: #... |
| ... | | | |

### Images
| Image | Position | Description | Aspect Ratio | Search terms |
|-------|----------|-------------|--------------|--------------|
| Hero | left col center | [VLM description] | 4:5 | [keywords for Unsplash] |
| Thumbnail 1 | below hero | [description] | 1:1 | |

### Interactive Elements → UX Flows
| Element | Label | Action |
|---------|-------|--------|
| Nav link | "Collections" | → collections page |
| Primary button | "Add to Cart" | → cart update |
| Thumbnail | [image n] | → swap main image |

---

## Finding replacement images

For each image described, search for similar free stock photos:
```bash
mmx search query --q "<search terms from Image table>" --output json --quiet
```
Use Unsplash or Pexels links from results. Dimensions/aspect ratio must match the original.
No need for exact match — same subject, tone, and aspect ratio is sufficient.

## Multiple images
Analyze each screen separately, then add **Flow Map** connecting screens via interactive elements.

## Handoff to Architect
| Section | → Artifact |
|---------|-----------|
| Layout Map | DESIGN.md layout skeleton + SPEC UX Flows structure |
| Color Palette | DESIGN.md design tokens (CSS custom properties) |
| Typography | DESIGN.md type scale |
| Components | SPEC in-scope list + DESIGN.md component specs |
| Interactive Elements | SPEC UX Flows (each = one flow step) |
| Images | Implementation placeholder or sourced via search |
