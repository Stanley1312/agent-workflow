---
id: full_workflow
description: Complete 5-step AI development workflow — load only when running a full feature build
model-recommendation: See individual agent files for model per step
---

# Skill: Full Workflow

> **Prerequisite:** Read `.ai/skills/setup.md` to install required tools before running this workflow.

> **Prerequisite:** Run `/setup` to install required tools before running this workflow.

## The Golden Loop

```
REQUIREMENTS.md
      ↓
Step 1: DISCOVERY        (Strategist)
      ↓
Step 2: TECHNICAL DESIGN  (Architect)
      ↓
Step 3: TEST GENERATION   (Tester) ←─────────────┐
      ↓                                           │ repeat per wave
Step 4: IMPLEMENTATION    (Implementor) ──────────┘
      ↓
Step 5: VERIFICATION + INGESTION  (Verifier + Architect)
      ↓
llm-wiki/ updated → active/ cleared → REQUIREMENTS.md
      ↑_________________________________________________|
```

---

## Step 1: Discovery (Strategist)
**Agent:** `.ai/agents/strategist.md`
**Model:** opus
**Skill:** `.ai/skills/discussion_protocol.md`

- Run structured interview (minimum 5 questions)
- Do NOT proceed without clear answers to: problem, success, must-haves, out-of-scope, dependencies
- Output: `REQUIREMENTS.md` updated, `CLAUDE.md` Part 1 generated (first run only)

---

## Step 2: Technical Design (Architect)
**Agent:** `.ai/agents/architect.md`
**Model:** opus

- Load wiki context before writing anything
- Use GitNexus to understand existing codebase
- Write `SPEC.md` → get user approval → write `PLAN.md`
- PLAN must declare wave dependencies and files touched
- **HARD GATE:** No handoff to Tester without explicit user approval of SPEC

---

## Step 3: Test Generation (Tester)
**Agent:** `.ai/agents/tester.md`
**Model:** sonnet
**Per wave:**

- Read SPEC acceptance criteria for this wave
- Use GitNexus to understand dependencies in files being touched
- Write ALL tests for this wave BEFORE any implementation
- Confirm tests are RED (failing) before handoff
- Report: "[N] tests written, all failing, Wave [X] ready"

---

## Step 4: Implementation (Implementor)
**Agent:** `.ai/agents/implementor.md`
**Model:** haiku
**Per wave:**

- Green phase: write minimal code to pass each test one by one
- After all wave tests green: Refactor (within same wave scope)
- Update STATE.md checkpoint after each test passes
- Run full suite after refactor — must stay green
- Report: "Wave [X] complete, [N] tests passing"

→ Repeat Step 3 + 4 for each wave in PLAN.md

---

## Step 5: Verification + Ingestion (Verifier → Architect)
**Verifier Agent:** `.ai/agents/verifier.md`
**Model:** sonnet

Verifier runs in order:
1. Full test suite (calls Tester) — must be 0 failures
2. Linter + type check — 0 errors
3. SPEC coverage check — every AC must have a test
4. UI verification via Playwright (if applicable)
5. Security spot check

**If FAIL:** Route to correct agent with failure report. Return to Step 3 or 4.

**If PASS:**

**Architect Agent:** `.ai/agents/architect.md`
**Model:** opus

Ingestion:
1. Update `llm-wiki/wiki/architecture/`
2. Log decisions → `llm-wiki/wiki/decisions/`
3. Log pitfalls → `llm-wiki/wiki/pitfalls/`
4. Update `llm-wiki/wiki/index.md`
5. Archive `active/current/` → `llm-wiki/raw/history/YYYY-MM-DD-[feature]/`
6. Clear `.ai/active/current/`
7. Update `ROADMAP.md`
8. Run `npx gitnexus analyze` — re-index codebase so knowledge graph reflects new code
9. Run `npx gitnexus wiki` — regenerate wiki docs from updated graph

---

## Bug Fix Interrupt (any step)

When Verifier or user discovers a bug:

```
→ Load .ai/agents/debugger.md
→ Run /debug [symptom]
→ Debugger produces root cause report with recommended action

If bug is in CURRENT feature:
  → Reflect back to correct layer (SPEC/PLAN/Test/Code)
  → Re-run affected waves only (use PLAN.md wave dependencies)

If bug is from LEGACY feature:
  → Architect: set current STATE.md to PAUSED
  → Move active/current/ → active/paused/
  → Create new bug fix task in active/current/
  → Run full 5-step workflow for bug fix
  → After bug fix ingested → /workflow resume
```

---

## Chain of Truth
```
SPEC → PLAN → Tests → Code
```
A bug must be fixed at its root layer and cascaded downward. Never patch code without updating the layer above it first.
