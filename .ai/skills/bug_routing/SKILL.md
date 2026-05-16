---
name: bug_routing
description: "Mandatory protocol for ALL agents when encountering any bug, unexpected behavior, test failure, or error. Invoke this skill immediately — before any investigation or fix attempt. Never self-diagnose. Never self-fix. This skill routes the bug to the correct agent via Debugger. Trigger on: test failures, runtime errors, behavior not matching SPEC, V1-V5 verification failures, or any output that doesn't match expectation."
---

# Bug Routing Protocol

## ⛔ Hard Rule
No agent may investigate or fix a bug on their own.
Invoke this skill first — always.

Skipping this protocol = patching the wrong layer = compounding the problem.

---

## Step 1 — Report raw symptom to Debugger

You do not need to investigate. Report only what you directly observed:
- "Test [name] failed with [error]"
- "Output was [X] but expected [Y]"
- "Error occurred at [file/line]"

Invoke `.ai/agents/debugger.md` with this raw symptom.
Debugger will collect full context, trace root cause, and determine layer.

---

## Step 2 — Wait for Debugger's layer report

| Layer | Meaning |
|-------|---------|
| `SPEC` | The requirement was wrong or ambiguous |
| `PLAN` | The wave design was wrong |
| `Test` | The test is wrong or incomplete |
| `Code` | The implementation is wrong |
| `Legacy` | Bug originates outside current feature scope |

---

## Step 3 — Route based on layer

| Debugger Layer | Route to | Action |
|----------------|----------|--------|
| `SPEC` | Architect | Revise SPEC → cascade to PLAN → Tests → Code |
| `PLAN` | Architect | Revise PLAN → re-run affected waves |
| `Test` | Tester | Fix or add tests → re-run RED phase |
| `Code` | Implementor | Fix implementation → Tester confirms GREEN |
| `Legacy` | Architect | Trigger Interrupt Protocol (pause current task) |

**Always fix at the root layer. Never patch downstream without fixing upstream first.**

---

## Layer dispute rule
If agents disagree on layer after 2 routing attempts → escalate to user.
Do not loop further.