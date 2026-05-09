---
name: explore
description: Explore and understand any part of the codebase. Invoke when user asks how something works, what depends on what, or wants to understand a file or feature.
---

# Skill: /explore

## Protocol

1. Check if GitNexus index is fresh — if not, run `npx gitnexus analyze` first
2. Match the target to the right GitNexus skill:
   - Navigating unfamiliar code → `.claude/skills/gitnexus/exploring/SKILL.md`
   - Blast radius / impact analysis → `.claude/skills/gitnexus/impact-analysis/SKILL.md`
   - Tracing a bug → `.claude/skills/gitnexus/debugging/SKILL.md`
   - Planning a refactor → `.claude/skills/gitnexus/refactoring/SKILL.md`
3. Execute using the appropriate MCP tools:
   - `query` — find related execution flows
   - `context` — 360° view of a symbol
   - `impact` — what breaks if this changes
4. Return a clear summary:
   - What the target does
   - What depends on it
   - What it depends on
   - Key files to know about

## Usage
```
/explore src/auth/validate.ts
/explore how does the payment flow work
/explore what depends on UserService
```

Can be used standalone at any time.
