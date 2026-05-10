# /workflow run

> **Prerequisite:** Run `/setup` to install required tools before running.

## What this command does
Read current state → continue from where work left off → if nothing in progress, start next feature.

---

## Step 1 — Check current state
Read `.ai/active/current/STATE.md`:
- **File exists with in-progress status** → resume from last checkpoint (see Resume Logic below)
- **File exists with PAUSED status** → tell user: "A paused task exists. Run `/workflow resume` to continue it or `/workflow status` to review."
- **No files in active/current/** → start new feature (continue to Step 2)

---

## Step 2 — Select next feature
Load `.ai/agents/architect.md`
- Read `REQUIREMENTS.md` → present highest priority items to user → confirm selection

---

## Step 3 — Design phase
Architect:
- Writes `.ai/active/current/SPEC.md`
- Gets user approval (hard gate — never skip)
- Creates `.ai/active/current/STATE.md` with first checkpoint
- Creates `.ai/active/current/PLAN.md`

---

## Step 4 — Wave loop
Repeat for each wave in PLAN.md:

**4a. Test generation**
Load `.ai/agents/tester.md` with context:
- Current wave name and acceptance criteria from PLAN.md
- SPEC path: `.ai/active/current/SPEC.md`
- PLAN path: `.ai/active/current/PLAN.md`

When Tester reports "[N] tests written, all failing" → proceed to 4b.

**4b. Implementation**
Load `.ai/agents/implementor.md` with context:
- Current wave name and test files from PLAN.md
- SPEC path: `.ai/active/current/SPEC.md`
- PLAN path: `.ai/active/current/PLAN.md`
- STATE path: `.ai/active/current/STATE.md`

When Implementor reports "Wave [name] code complete" → proceed to 4c.

**4c. GREEN confirmation**
Load `.ai/agents/tester.md` for GREEN phase with context:
- Wave name just completed
- Test files for this wave

When Tester reports "Wave [name] GREEN" → proceed to next wave or Step 5.

---

## Step 5 — Verification
Load `.ai/agents/verifier.md`

Verifier runs V1–V5 checklist:

| Check | Pass | Fail | Warn |
|-------|------|------|------|
| V1 — Test suite | 0 failures | any failure | — |
| V2 — Linter/types | 0 errors | any error | warnings only |
| V3 — SPEC coverage | all AC covered | missing AC | — |
| V4 — UI (if applicable) | all interactions respond | any broken | — |
| V5 — Security | no issues | any issue | — |

**V4 is mandatory** if project contains `templates/`, `*.html`, `*.jsx`, `*.vue`, `*.svelte` — cannot self-declare N/A.

**Outcomes:**
- ✅ PASS — no FAIL in any step → proceed to Step 6
- ⚠️ WARN — V2 warnings only → log in STATE.md, proceed to Step 6
- ❌ FAIL — any step fails → route to correct agent:
  - V1/V3 → Tester or Implementor
  - V2 errors → Implementor
  - V4 → Implementor
  - V5 → Architect reviews SPEC → Implementor fixes code

**Bug routing on FAIL:**
- Load `.ai/agents/debugger.md` → identify root layer (SPEC / PLAN / Test / Code)
- Fix at root layer → cascade downward → re-run affected waves only
- Layer dispute after 2 attempts → escalate to user

---

## Step 6 — Ingestion
Load `.ai/agents/architect.md`
- Run wiki ingest workflow
- Run `npx gitnexus analyze`
- Run `npx gitnexus wiki` (skip if no LLM API key)
- Update `ROADMAP.md` milestone status
- Archive `active/current/` → `llm-wiki/raw/history/YYYY-MM-DD-[feature]/`
- Clear `.ai/active/current/`

Confirm: "Feature complete. Run `/workflow run` to start the next feature."

---

## Resume Logic
When STATE.md shows in-progress work, read last checkpoint and continue:

| Last checkpoint in STATE.md | Resume from |
|-----------------------------|-------------|
| SPEC APPROVED | Step 3 — create STATE + PLAN |
| PLAN WRITTEN | Step 4 — start first wave |
| Wave [N] code complete | Step 4c — GREEN confirmation for Wave [N] |
| Wave [N] GREEN | Step 4a — next wave test generation |
| All waves complete | Step 5 — Verification |
