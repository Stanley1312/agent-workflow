# Step 0 — State Check

## 1. Check llm-wiki/
If `llm-wiki/` does not exist → invoke `setup` skill first, then return here.

## 2. Check active/current/

### A. Empty
Check `active/paused/`:
- Has files →
  1. Move all files: `active/paused/` → `active/current/`
  2. Read restored `STATE.md` → find last checkpoint
  3. Go to Resume Table below
- Empty → go to `discovery.md` Step 1

### B. Has files, no STATE.md (orphaned state)
Tell user:
> "Found [list files] in active/current/ but no STATE.md —
> looks like an incomplete task. Clear and start fresh, or try to continue?"

- Clear → delete all files in `active/current/` → go to `discovery.md` Step 1
- Continue → invoke `architect`:
  > "Reconstruct STATE.md from existing SPEC.md and PLAN.md in
  > active/current/. Set status IN_PROGRESS, checkpoint: PLAN WRITTEN."
  Then go to Resume Table

### C. Has STATE.md

**IN_PROGRESS** →
Tell user:
> "Found in-progress task: [feature name], last checkpoint: [X].
> Resume, or pause and start a new feature?"

- Resume → go to Resume Table
- Start new → invoke `architect`:
  > "Set STATE.md status = PAUSED with reason = 'user started new feature'.
  > Move all files in active/current/ → active/paused/."
  Then go to `discovery.md` Step 1

**COMPLETE** →
Check Ingestion Checklist in STATE.md:
- Any item unchecked → invoke `ingest` skill
- All checked → go to `discovery.md` Step 1

**PAUSED** → same as A (Has files), treat `active/paused/` as the source

---

## Resume Table

| Last checkpoint in STATE.md | Resume from |
|-----------------------------|-------------|
| SPEC APPROVED | Step 3 — invoke architect to write PLAN |
| PLAN WRITTEN | Step 4 Wave 1 — read `wave.md` |
| Wave [N] code complete | Step 4c — GREEN for Wave [N] — read `wave.md` |
| Wave [N] GREEN | Step 4a — next wave — read `wave.md` |
| All waves GREEN | Step 5 — read `verify.md` |
| Verification passed | Step 6 — invoke `ingest` skill |
