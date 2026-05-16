---
name: workflow
description: "Run the full AI development workflow: Discovery → Design → Test → Implement → Verify. Use this skill whenever the user wants to build a feature, start a new project, check progress on a task, resume work after a bug fix, or run any /workflow command (init, run, status, resume). Also trigger when the user mentions REQUIREMENTS.md, SPEC.md, PLAN.md, STATE.md, or any of the agent roles (Strategist, Architect, Tester, Implementor, Verifier, Debugger). If in doubt, use this skill — it coordinates the whole development loop."
license: Proprietary. LICENSE.txt has complete terms
---

# AI Development Workflow

## The Golden Loop

```
REQUIREMENTS.md
      ↓
Step 1: DISCOVERY         (Strategist)
      ↓
Step 2: TECHNICAL DESIGN  (Architect)
      ↓
Step 3: TEST GENERATION   (Tester)  ←──────────────┐
      ↓                                             │ repeat per wave
Step 4: IMPLEMENTATION    (Implementor) ────────────┘
      ↓
Step 5: VERIFICATION + INGESTION  (Verifier + Architect)
      ↓
llm-wiki/ updated → active/ cleared → REQUIREMENTS.md updated
      ↑_______________________________________________|
```

---

## Agent Roles

| Agent | File | Responsibility |
|-------|------|----------------|
| Strategist | `.ai/agents/strategist.md` | Discovery interview → `REQUIREMENTS.md` |
| Architect | `.ai/agents/architect.md` | `SPEC.md` + `PLAN.md` authoring, escalation, ingestion |
| Tester | `.ai/agents/tester.md` | Write tests (RED), confirm pass (GREEN) |
| Implementor | `.ai/agents/implementor.md` | Write code to satisfy tests |
| Verifier | `.ai/agents/verifier.md` | Quality gate after all waves complete |
| Debugger | `.ai/agents/debugger.md` | Root cause analysis only |

Each agent file defines its own behaviour — invoke it, don't repeat or override it.

---

## Arguments

| Command | Action |
|---------|--------|
| `init` | Initialise a new project → follow `@init.md` |
| `run` | Build next feature or resume in-progress work → follow `@run.md` |
| `status` | Show current task progress → see [Status](#workflow-status) below |
| `resume` | Resume a paused task after a bug fix → see [Resume](#workflow-resume) below |

---

## Step-by-Step Reference

### Step 1 — Discovery
- **Agent:** Strategist
- **Output:** `REQUIREMENTS.md` updated

### Step 2 — Technical Design
- **Agent:** Architect
- **Output:** `SPEC.md` (user-approved) + `STATE.md` + `PLAN.md`
- **HARD GATE:** The user must explicitly approve `SPEC.md` before proceeding. Do not advance without confirmation.

### Steps 3 + 4 — Wave Loop *(repeat per wave in `PLAN.md`)*
- **Step 3 — Test Generation:** Tester writes tests → confirms RED → reports back
- **Step 4 — Implementation:** Implementor writes code → Tester confirms GREEN → advance to next wave

### Step 5 — Verification + Ingestion
- **Agent:** Verifier → runs V1–V5 checklist → reports outcome
- **PASS / WARN:** Architect runs ingestion → archives task → clears `active/`
- **FAIL:** Route to Bug Routing below

---

## Bug Routing

### During a current feature
```
Debugger identifies root layer: SPEC / PLAN / Test / Code
→ Fix at the root layer first, then cascade downward
→ Re-run only the affected waves
→ If layer is disputed after 2 attempts → escalate to user
```

### Legacy bug interrupt
```
Architect: pause current STATE.md
→ Move active/current/ → active/paused/
→ Create new bug-fix task in active/current/
→ Run the full workflow for the bug fix
→ Once ingested → run /workflow resume
```

---

## Chain of Truth

```
SPEC → PLAN → Tests → Code
```

Always fix at the root layer and cascade down. Never patch code without first updating the layer above it.

---

## /workflow status

1. Read `.ai/active/current/STATE.md` — print wave progress.
2. Check `.ai/active/paused/` — report any paused task and its reason.
3. Summarise: current wave, completed tasks, blockers.

---

## /workflow resume

1. Read `.ai/active/paused/STATE.md` — confirm a paused task exists.
2. Confirm `.ai/active/current/` is empty — if not, tell the user to resolve the current task first.
3. Move `.ai/active/paused/` contents → `.ai/active/current/`.
4. Read `STATE.md` last checkpoint → continue from that point (same resume logic as `/workflow run`).