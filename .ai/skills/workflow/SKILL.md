---
name: workflow
description: "Orchestrates the full AI development workflow: Discovery → Design → Test → Implement → Verify. Invoke whenever the user wants to build something, start a feature, continue in-progress work, or coordinate any development step. Trigger on: 'build', 'create', 'implement', 'start feature', 'continue', 'what's next'."
license: Proprietary. LICENSE.txt has complete terms
---

# AI Development Workflow

## Your Role: Orchestrator
You coordinate this workflow using the **Agent tool** to invoke subagents.
You do NOT write code, tests, or specs yourself.
**Every subagent invocation MUST begin with the Standard Preamble below.**

---

## Standard Preamble — prepend to every subagent prompt
> "Before starting, read all files in `.ai/rules/` and follow them."

---

## Step 0 — Check state

Read `.ai/active/current/STATE.md`:
- **IN_PROGRESS** → check Resume Table below, skip to correct step
- **COMPLETE** → check Ingestion Checklist in STATE.md. If any item unchecked → run Step 6. If all checked → proceed to Step 1.
- **Not found** → check `active/paused/`:
  - Has content → move `active/paused/` contents → `active/current/` → read restored STATE.md → resume from checkpoint
  - Empty → proceed to Step 1

---

## Step 1 — Discovery
Check if `REQUIREMENTS.md` has real content (not just placeholders):
- **No real content** → invoke `strategist`:
  > "Run discovery interview. Output: CLAUDE.md Part 1, REQUIREMENTS.md, ROADMAP.md."
- **Has content** → skip to Step 2

---

## Step 2 — Select feature
Invoke `architect`:
> "Read REQUIREMENTS.md. Present highest-priority unstarted items to user. Confirm selection. Report back feature name + requirements."

---

## Step 3 — Design
Invoke `architect`:
> "Design phase for: [feature].
> 1. Run Pre-SPEC Ritual
> 2. Write SPEC.md — get user approval (hard gate)
> 3. Create DESIGN.md if UI in scope (invoke ui-spec skill)
> 4. Create STATE.md (checkpoint: SPEC APPROVED)
> 5. Write PLAN.md
> Report when done."

---

## Step 4 — Wave loop
Read PLAN.md → repeat for each wave:

**4a. RED** — Invoke `tester`:
> "Write tests for [wave]. Confirm all failing. Report: '[N] tests written, all failing'."

**4b. Implement** — Invoke `implementor`:
> "Write code to satisfy tests for [wave]. Do not run tests. Report: 'Wave [name] code complete'."

**4c. GREEN** — Invoke `tester`:
> "Run tests for [wave]. Report 'Wave [name] GREEN' or structured failure list only: test name + one-line symptom per failing test."

- GREEN →
  1. Write checkpoint to STATE.md: `[date] — Wave [name] GREEN ([N] tests passing)`
  2. Update STATE.md wave Summary block (Built / Decisions / Errors hit)
  3. Write `raw/notes/wave-[name]-[feature].md` with same content (expanded)
  4. **If more waves remain** → proceed to next wave (repeat Step 4a)
  5. **If this is the last wave** →
     - Write checkpoint `All waves GREEN — [date]` to STATE.md
     - Update STATE.md `status: COMPLETE`
     - Proceed to Step 5
- FAIL →
  1. Do not analyze. Do not form hypotheses. Do not touch any file.
  2. Invoke `debugger` with structured failure list (test names + symptoms only)
  3. Debugger traces chain bottom-up: Code → Test → Plan → Spec — reports first discrepancy
  4. Route fix to identified layer: Code → `implementor` / Test → `tester` / Plan → `architect`
  5. After fix: re-invoke `tester` GREEN (back to Step 4c)
  6. **Same tests still fail after 2 full cycles** → stop. Report to user: which tests, what was tried.

---

## Step 5 — Verify
Invoke `verifier`:
> "Run V1–V5 checklist on SPEC.md. Report each: PASS/WARN/FAIL."

- PASS/WARN → Step 6
- FAIL → invoke `bug-routing` skill

---

## Step 6 — Ingest
Invoke `architect`:
> "Run post-task ingestion:
> 1. Archive `active/current/` → `llm-wiki/raw/history/YYYY-MM-DD-[feature]/`
> 2. Clear `active/current/` (delete all files)
> 3. Invoke `wiki` skill
> 4. Update `REQUIREMENTS.md` — mark feature `[x] Completed YYYY-MM-DD`, replace `Done when` with `Result: [what was built, test count]`
> 5. Update `ROADMAP.md` — mark milestone ✅ Done if complete, update Current Sprint to next focus
> 6. Run `npx gitnexus analyze`
> Confirm each step via STATE.md Ingestion Checklist."

Done → tell user: "Feature complete. Say 'continue' to start next feature."

---

## Resume Table
| STATE.md checkpoint | Resume from |
|---------------------|-------------|
| SPEC APPROVED | Step 3 — write PLAN |
| PLAN WRITTEN | Step 4 — first wave |
| Wave [N] code complete | Step 4c — GREEN for Wave [N] |
| Wave [N] GREEN | Step 4a — next wave |
| All waves GREEN | Step 5 |
