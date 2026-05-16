# /workflow run

> **Prerequisite:** Run `/setup` to install required tools before running.

## Your role
You are the **workflow orchestrator**. Execute this script by invoking subagents and coordinating their output. Do not perform any development work yourself — every task is delegated to the correct subagent.

---

## Step 1 — Check current state

Read `.ai/active/current/STATE.md`:

- **File exists with in-progress status** → resume from last checkpoint (see Resume Logic below)
- **File exists with PAUSED status** → auto-restore:
  1. Move `.ai/active/paused/` contents → `.ai/active/current/`
  2. Read `STATE.md` last checkpoint → resume from that point (see Resume Logic below)
- **No files in active/current/** → proceed to Step 2

---

## Step 2 — Select next feature

**Invoke the `architect` subagent** with this task:
> "Read REQUIREMENTS.md. Present the highest-priority unstarted items to the user. Ask the user to confirm which feature to build next. Report back the selected feature name and its requirements."

Wait for Architect to report the selected feature before continuing.

---

## Step 3 — Design phase

**Invoke the `architect` subagent** with this task:
> "Design phase for: [selected feature].
> 1. Run your Pre-SPEC Ritual (read llm-wiki/, research stack).
> 2. Write `.ai/active/current/SPEC.md` using `.ai/templates/SPEC.template.md`.
> 3. Present SPEC to user and get explicit approval (hard gate — never skip).
> 4. After approval: create `.ai/active/current/STATE.md` (checkpoint: SPEC APPROVED).
> 5. Create `.ai/active/current/PLAN.md` using `.ai/templates/PLAN.template.md`.
> Report back when SPEC is approved and PLAN is written."

Wait for Architect to confirm SPEC approved + PLAN written before continuing.

---

## Step 4 — Wave loop

Read `PLAN.md` to get the list of waves. Repeat Steps 4a–4c for each wave:

### 4a. Test generation

**Invoke the `tester` subagent** with this task:
> "RED phase for [wave name].
> SPEC: `.ai/active/current/SPEC.md`
> PLAN: `.ai/active/current/PLAN.md`
> Write all tests for this wave. Confirm all tests are failing (RED). Report: '[N] tests written, all failing'."

Wait for Tester to confirm RED before continuing to 4b.

### 4b. Implementation

**Invoke the `implementor` subagent** with this task:
> "Implement [wave name].
> SPEC: `.ai/active/current/SPEC.md`
> PLAN: `.ai/active/current/PLAN.md`
> STATE: `.ai/active/current/STATE.md`
> Write code to satisfy the failing tests. Do not run tests. Report: 'Wave [name] code complete'."

Wait for Implementor to report code complete before continuing to 4c.

### 4c. GREEN confirmation

**Invoke the `tester` subagent** with this task:
> "GREEN phase for [wave name].
> Run the tests for this wave. Confirm all pass. Report: 'Wave [name] GREEN' or report any failures."

- **GREEN** → update STATE.md checkpoint → proceed to next wave (or Step 5 if last wave)
- **FAIL** → invoke `.ai/skills/bug_routing/SKILL.md` immediately. Do not proceed.

---

## Step 5 — Verification

**Invoke the `verifier` subagent** with this task:
> "Run the V1–V5 verification checklist.
> SPEC: `.ai/active/current/SPEC.md`
> Report outcome for each check: PASS / WARN / FAIL."

**Outcomes:**
- ✅ PASS (or ⚠️ WARN — V2 warnings only) → proceed to Step 6
- ❌ FAIL → invoke `.ai/skills/bug_routing/SKILL.md` immediately. Do not proceed.

---

## Step 6 — Ingestion

**Invoke the `architect` subagent** with this task:
> "Run post-task ingestion for the completed feature.
> Follow your Post-Task Ingestion protocol:
> - Update llm-wiki/
> - Archive active/current/ → llm-wiki/raw/history/
> - Clear .ai/active/current/
> - Update ROADMAP.md
> - Run npx gitnexus analyze
> Report when complete."

When Architect confirms ingestion complete:
→ Tell the user: "Feature complete. Run `/workflow run` to start the next feature."

---

## Resume Logic

When STATE.md shows in-progress work, read last checkpoint and continue from the correct step:

| Last checkpoint in STATE.md | Resume from |
|-----------------------------|-------------|
| SPEC APPROVED | Step 3 — invoke Architect to create STATE + PLAN |
| PLAN WRITTEN | Step 4 — start first wave (4a) |
| Wave [N] code complete | Step 4c — invoke Tester GREEN for Wave [N] |
| Wave [N] GREEN | Step 4a — invoke Tester RED for next wave |
| All waves complete | Step 5 — invoke Verifier |
