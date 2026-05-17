---
feature: <!-- from SPEC -->
started: YYYY-MM-DD HH:MM
last_updated: YYYY-MM-DD HH:MM
status: IN_PROGRESS
---

# STATE: [Feature Name]
> Live tracking file. Updated by Architect when SPEC is approved. Updated by Implementor after each wave. Updated by Verifier after verification.

## Overall Status
🔄 IN_PROGRESS | ⏸️ PAUSED | ✅ COMPLETE | ❌ BLOCKED

**Current blocker:** None
**Pause reason:** <!-- fill if PAUSED -->

---

## Checkpoints

- [ ] ✅ SPEC APPROVED — <!-- date -->
- [ ] ✅ STATE.md + PLAN.md created — <!-- date -->
- [ ] ✅ [Wave name] complete — <!-- date -->
- [ ] ✅ [Wave name] complete — <!-- date -->
- [ ] ✅ All waves GREEN — <!-- date -->
- [ ] ✅ Verification passed — <!-- date -->
- [ ] ✅ Ingestion complete — <!-- date -->

---

## Waves

<!-- Architect fills wave names from PLAN.md when creating this file -->
<!-- Implementor fills status after completing each wave -->
<!-- Never use generic names like "Wave 1" — use domain names -->

<!-- Repeat this block for each wave defined in PLAN.md -->
### Wave: [Name]
- [ ] ⬜ [test description]
- [ ] ⬜ [test description]
**Status:** ⬜ Pending

#### Summary (fill on GREEN)
- **Built:** <!-- what was implemented -->
- **Decisions:** <!-- non-obvious choices made and why -->
- **Errors hit:** <!-- bugs encountered and how resolved -->
- **Note filed:** `raw/notes/wave-[name]-[feature].md` ⬜

---

## Escalation Log
<!-- Filled by Implementor when retry limit is hit -->
<!-- Format:
### Escalation — [timestamp]
**Wave:** [name]
**Test:** [test name]
**Escalated to:** Architect / User
**Resolution:** [what Architect advised]
-->

---

## Verification

**Status:** ⬜ Pending | 🔄 In Progress | ✅ PASS | ⚠️ WARN | ❌ FAIL

| Step | Result | Notes |
|------|--------|-------|
| V1 — Test suite | ⬜ | |
| V2 — Linter + types | ⬜ | |
| V3 — SPEC coverage | ⬜ | |
| V4 — UI verification | ⬜ | |
| V5 — Security check | ⬜ | |

### Verification Log
<!-- Filled by Verifier — add failure reports here if any -->

---

## Ingestion

**Status:** ⬜ Pending | ✅ Complete

### Ingestion Checklist
<!-- Filled by Architect -->
- [ ] wiki/architecture/ updated
- [ ] wiki/decisions/ updated
- [ ] wiki/pitfalls/ updated
- [ ] wiki/index.md updated
- [ ] Archived to llm-wiki/raw/history/YYYY-MM-DD-[feature]/
- [ ] active/current/ cleared
- [ ] ROADMAP.md updated
- [ ] `npx gitnexus analyze` run
- [ ] `npx gitnexus wiki` run *(skip if LLM API key not configured)*