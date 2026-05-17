---
name: workflow
description: "Orchestrates the full AI development workflow: Discovery → Design → Test → Implement → Verify. Invoke whenever the user wants to build something, start a feature, continue in-progress work, or coordinate any development step. Trigger on: 'build', 'create', 'implement', 'start feature', 'continue', 'what's next'."
license: Proprietary. LICENSE.txt has complete terms
---

# AI Development Workflow

## Your Role: Orchestrator
You coordinate this workflow using the **Agent tool** to invoke subagents.
You do NOT write code, tests, or specs yourself.

---

## Step 0 — Always check state first
Read `.ai/active/current/STATE.md`:
- **In-progress** → skip to the correct step in Resume Table below
- **PAUSED** → move `.ai/active/paused/` contents → `.ai/active/current/` → resume from checkpoint
- **Not found** → proceed to Step 1

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
> "Run tests for [wave]. Report: 'Wave [name] GREEN' or report failures."

- GREEN →
  1. Write checkpoint to STATE.md Checkpoints section: `[date] — Wave [name] GREEN ([N] tests passing)`
  2. Update STATE.md wave Summary block (Built / Decisions / Errors hit)
  3. Write `raw/notes/wave-[name]-[feature].md` with same content (expanded)
  4. If this is the **last wave** in PLAN.md: write checkpoint `All waves GREEN — [date]` to STATE.md
  5. Compact context → proceed to next wave (or Step 5 if last wave)
- FAIL → invoke `.ai/skills/bug_routing/SKILL.md`

---

## Step 5 — Verify
Invoke `verifier`:
> "Run V1–V5 checklist on SPEC.md. Report each: PASS/WARN/FAIL."

- PASS/WARN → Step 6
- FAIL → invoke `.ai/skills/bug_routing/SKILL.md`

---

## Step 6 — Ingest
Invoke `architect`:
> "Run post-task ingestion: update llm-wiki/, archive active/current/, update ROADMAP.md, run npx gitnexus analyze."

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
