# Frontend Design Skill

## Overview

This skill guides the creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. It should be applied during the design phase (Architect) and implementation phase (Implementor) when building web UI.

---

## Design Thinking Framework

Before coding any UI, establish a **BOLD aesthetic direction**:

- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme aesthetic direction:
  - Brutally minimal / Maximalist chaos
  - Retro-futuristic / Organic/natural
  - Luxury/refined / Playful/toy-like
  - Editorial/magazine / Brutalist/raw
  - Art deco/geometric / Soft/pastel
  - Industrial/utilitarian
- **Constraints**: Technical requirements (framework, performance, accessibility)
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

> **CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work—the key is intentionality, not intensity.

---

## Techniques & Guidelines

### 1. Typography
- Choose fonts that are **beautiful, unique, and interesting**
- **Avoid** generic fonts: Arial, Inter, Roboto, system fonts
- Opt for distinctive choices that elevate aesthetics
- Pair a **distinctive display font** with a **refined body font**

### 2. Color & Theme
- Commit to a **cohesive aesthetic**
- Use **CSS variables** for consistency
- Dominant colors with **sharp accents** outperform timid, evenly-distributed palettes

### 3. Motion
- Use animations for effects and micro-interactions
- Prioritize **CSS-only solutions** for HTML
- Use **Motion library** for React when available
- Focus on **high-impact moments**: one well-orchestrated page load with staggered reveals creates more delight than scattered micro-interactions
- Use scroll-triggering and hover states that surprise

### 4. Spatial Composition
- **Unexpected layouts**
- Asymmetry, overlap, diagonal flow
- Grid-breaking elements
- Generous negative space OR controlled density

### 5. Backgrounds & Visual Details
- Create **atmosphere and depth** rather than solid colors
- Apply creative forms:
  - Gradient meshes
  - Noise textures
  - Geometric patterns
  - Layered transparencies
  - Dramatic shadows
  - Decorative borders
  - Custom cursors
  - Grain overlays

---

## NEVER Use

- Generic AI-generated aesthetics
- Overused font families (Inter, Roboto, Arial, system fonts)
- Cliched color schemes (particularly **purple gradients on white backgrounds**)
- Predictable layouts and component patterns
- Cookie-cutter design that lacks context-specific character
- Common choices like Space Grotesk

---

## Implementation Guidance

| Aesthetic Type | Code Complexity |
|---------------|-----------------|
| **Maximalist designs** | Need elaborate code with extensive animations and effects |
| **Minimalist/refined designs** | Need restraint, precision, careful attention to spacing, typography, and subtle details |

> **Elegance comes from executing the vision well.**

---

## Key Principle

> *"Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics."*

The skill emphasizes that Claude is capable of extraordinary creative work—**don't hold back**, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.

---

## Integration with Workflow

### Architect (design phase)
- Before writing SPEC.md UI sections, deliberate on the aesthetic direction
- Document the chosen tone, font choices, color palette, and motion approach in SPEC.md
- Set explicit UI quality standards as acceptance criteria

### Implementor (implementation phase)
- Apply the aesthetic direction from SPEC when building UI components
- Reject skeleton HTML — every component should have visual character
- Use CSS variables for the color palette and typography system
- Add meaningful micro-interactions and hover states
- Create depth with shadows, textures, or gradients — not flat solid colors
