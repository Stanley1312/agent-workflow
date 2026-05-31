# Step 5 — Verification

## Before invoking Verifier
Read `.ai/active/current/SPEC.md` and check scope:
- UI in scope → full V1–V5
- Backend-only (no UI, no Playwright mentioned in SPEC) → skip V4, run V1–V3 + V5 only

## Invoke verifier
> "Run verification checklist.
> SPEC: .ai/active/current/SPEC.md
> Scope: [full / backend-only — skip V4]
> Report each check: PASS / WARN / FAIL with evidence."

## Outcomes
- ✅ All PASS or WARN (V2 only) →
  Spawn subagent with tools (Read, Write, Edit, Bash):
  > "Run the ingest skill: read `.ai/skills/ingest/SKILL.md` and follow it."

- ❌ Any FAIL → invoke `bug-routing` skill immediately. Do not proceed.
