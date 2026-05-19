---
name: design-spec
description: "Generate DESIGN.md — the project's design language. Invoke after SPEC is approved when SPEC contains UX Flows. Reads active/current/designs/ for screen analyses if available (from mmx-vision), otherwise researches independently. Output: .ai/active/current/DESIGN.md"
---

# Skill: Design Spec

Produces a concrete, implementor-ready DESIGN.md — the design language for the entire project.
Not vague principles — specific hex codes, px values, CSS-ready component specs.
Implementor must follow this file strictly for all UI waves.

## Step 1 — Read context
Read `.ai/active/current/SPEC.md` — app type, target user, UX Flows, tech constraints.

## Step 2 — Get design material
Check if `active/current/designs/` has any files:
- **Has files** → read all screen analyses. These are the source of truth for layout, colors, typography, components. Do not override with web research.
- **Empty** → run web search for design references:
  - "[app type] UI design [current year]"
  - "[app type] design system color palette"
  - "[tone direction] UI [current year]"
  Pick 2-3 concrete references. Extract: color approach, typography style, spatial density.

## Step 3 — Aesthetic direction
Before any design decision, commit to a clear direction:

**Choose ONE bold aesthetic and execute with precision:**
- Brutally minimal / Maximalist / Retro-futuristic
- Editorial/magazine / Industrial/utilitarian
- Luxury/refined / Playful/toy-like / Brutalist/raw

Ask: what makes this UNFORGETTABLE? What is the one thing someone will remember?

**Typography:**
- Pair a distinctive display font with a refined body font
- Never: Inter, Roboto, Arial, Space Grotesk, system fonts

**Color:**
- Dominant palette with sharp accents — not timid, evenly-distributed palettes
- All values as CSS variables
- Never: purple gradients on white, generic AI-slop palettes

**Spatial composition:**
- Unexpected layouts — asymmetry, overlap, generous negative space OR controlled density
- Grid-breaking elements where impactful

**Never:** cookie-cutter patterns, predictable component layouts, generic aesthetics.

## Step 4 — Write DESIGN.md
Use `.ai/templates/DESIGN.template.md`.
Every value must be actionable:
- Colors → hex codes
- Sizes → px values
- Shadows → full CSS value
- Components → shape, colors, states described precisely
- No vague descriptions ("modern", "clean", "minimal") — show don't tell

## Step 5 — Store
- `active/current/DESIGN.md` — active reference for implementor
- `raw/designs/[feature]-design.md` — for wiki ingestion after task complete
