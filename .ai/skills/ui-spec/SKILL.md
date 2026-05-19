---
name: ui-spec
description: "DEPRECATED — replaced by design-spec skill. Do not invoke."
deprecated: true
replaced_by: .ai/skills/design-spec/SKILL.md
---

> ⚠️ **DEPRECATED** — This skill has been replaced by `.ai/skills/design-spec/SKILL.md`.
> Do not invoke this skill. Use `design-spec` instead.

# Skill: UI Spec

## Purpose
Generate a concrete, implementor-ready DESIGN.md from SPEC + research.
Not vague principles — specific hex codes, pixel values, component specs.
Implementor must follow this file strictly for all UI waves.

## When to invoke
Called by Architect after SPEC is approved, before writing PLAN.md, when SPEC has any UI scope.

## Process

### Step 1 — Read context
1. Read `.ai/active/current/SPEC.md` — understand: app type, target user, UX Flows, tech constraints, browser support
2. Read `.claude/skills/frontend-design/SKILL.md` — internalize design principles (tone framework, what to avoid)

### Step 2 — Research
Web search for design references:
- "[app type] UI design inspiration [current year]"
- "[app type] design system color palette"
- "[tone direction] dashboard UI [current year]"

Pick 2-3 concrete references. Extract: color approach, typography style, spatial density.

### Step 3 — Design decisions
Based on SPEC + research, commit to:
- **Tone**: one clear direction from frontend-design framework (industrial/utilitarian, minimal/refined, etc.)
- **Color palette**: primary + accent + surface + semantic (success/error/warning)
- **Typography**: 2 fonts max — distinctive display + readable body. No generic fonts (Inter, Roboto, Arial)
- **Spacing**: base unit (4px or 8px system)
- **Component patterns**: buttons, cards, nav — fitting the app type and tone

### Step 4 — Write DESIGN.md
Use `.ai/templates/DESIGN.template.md`.
Every value must be actionable:
- Colors → hex codes
- Sizes → px values
- Shadows → full CSS value
- Components → shape, colors, states described
- No vague descriptions ("modern", "clean", "minimal") — show don't tell

### Step 5 — Store
Save to:
- `.ai/active/current/DESIGN.md` — active reference for implementor
- `raw/designs/[feature]-design.md` — for wiki ingestion after task complete
