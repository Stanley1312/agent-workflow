---
name: full_workflow
description: AI development workflow knowledge base — read this to understand the full flow, agent roles, and exception handling
---

# AI Development Workflow

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

## Agent Roles

| Agent | File | Responsibility |
|-------|------|----------------|
| Strategist | `.ai/agents/strategist.md` | Discovery interview → REQUIREMENTS.md |
| Architect | `.ai/agents/architect.md` | SPEC + PLAN authoring, escalation handler, ingestion |
| Tester | `.ai/agents/tester.md` | Write tests (RED), confirm tests pass (GREEN) |
| Implementor | `.ai/agents/implementor.md` | Write code to satisfy tests |
| Verifier | `.ai/agents/verifier.md` | Quality gate after all waves complete |
| Debugger | `.ai/agents/debugger.md` | Root cause analysis only |

Each agent file defines its own behavior — do not repeat or override it when invoking.

---

## Step 1: Discovery
**Agent:** Strategist → **Output:** `REQUIREMENTS.md` updated

---

## Step 2: Technical Design
**Agent:** Architect → **Output:** `SPEC.md` (user-approved) + `STATE.md` + `PLAN.md`

**HARD GATE:** User must explicitly approve SPEC before proceeding.

---

## Step 3 + 4: Wave Loop (repeat per wave)
**Step 3 — Test Generation:** Tester writes tests → confirms RED → reports back

**Step 4 — Implementation:** Implementor writes code → reports back → Tester confirms GREEN

Repeat for each wave in `PLAN.md`.

---

## Step 5: Verification + Ingestion
**Agent:** Verifier → runs V1–V5 checklist → reports outcome

**If PASS/WARN:** Architect runs ingestion → archives → clears active/

**If FAIL:** Route to correct agent (see Bug Routing below)

---

## Bug Routing

**During current feature:**
```
Debugger identifies root layer (SPEC / PLAN / Test / Code)
→ Fix at root layer first, cascade downward
→ Re-run affected waves only
→ Layer dispute after 2 attempts → escalate to user
```

**Legacy bug interrupt:**
```
Architect: pause current STATE.md → move active/current/ → active/paused/
→ Create new bug fix task in active/current/
→ Run full workflow for bug fix
→ After ingested → resume paused task
```

---

## Chain of Truth
```
SPEC → PLAN → Tests → Code
```
Always fix at the root layer and cascade down. Never patch code without updating the layer above first.
