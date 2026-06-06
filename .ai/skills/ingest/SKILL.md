---
name: ingest
description: "Post-feature ingestion workflow. Archives completed task, updates the wiki and shipped log, generates codebase documentation. Invoke after Verifier reports PASS or WARN to close out a completed feature."
---

# Skill: Ingest

Closes out a completed feature. Run once after Verifier reports PASS or WARN.

## Steps (in order)

### 1. Read context
Read `.ai/active/current/STATE.md` and `.ai/active/current/SPEC.md`:
- Feature name
- What was built (from STATE.md wave summaries)
- Test count (from last GREEN checkpoint)
- Any deviations from SPEC

### 2. Archive
Copy all files: `active/current/` → `llm-wiki/raw/history/YYYY-MM-DD-[feature]/`
Copy first, verify files landed, then proceed. Never clear before verifying.

### 3. Clear active/current/
Delete all files inside `active/current/`. Directory stays — workspace for the next feature.

### 4. Update the wiki
Invoke `wiki` skill — Ingest workflow. Reads `llm-wiki/raw/`, updates `llm-wiki/wiki/`.

### 5. Update shipped.md
Append to `llm-wiki/wiki/shipped.md` (create if not exists):
```
## [feature name] — [YYYY-MM-DD]
- **What:** [one sentence of what was built]
- **Tests:** [N] passing
- **Deviations:** [deviations from SPEC, or "none"]
```

If creating for the first time, add header first:
```
# Shipped Features
> Append-only. Updated on every ingest.
```

### 6. Generate codebase documentation
```bash
npx gitnexus wiki
```
Requires LLM API key — skip and note in report if not configured.

### 7. Report
```
Ingestion complete — [feature name]
✅ Archived to llm-wiki/raw/history/YYYY-MM-DD-[feature]/
✅ active/current/ cleared
✅ Wiki updated
✅ shipped.md updated
✅ GitNexus wiki generated (or: skipped — no API key)
```

## Rules
- Archive before clearing — always. If archiving fails, stop and report.
- shipped.md is append-only — never edit past entries.
- If any step fails → stop and report which step. Do not skip ahead.
