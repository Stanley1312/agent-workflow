---
name: bug-routing
description: "Mandatory protocol when encountering any bug, test failure, or unexpected behavior. Invoke immediately — before any investigation or fix attempt. Trigger on: test failures, runtime errors, output not matching expectation, V1-V5 verification failures."
---

# Bug Routing Protocol

## Trigger scenarios — invoke this skill when:
- A test fails during wave loop (Step 4c FAIL)
- Verifier reports FAIL (Step 5)
- User reports a runtime bug or unexpected behavior outside the wave loop

---

## ⛔ Hard Rule
No agent may investigate or fix a bug on their own.
Skipping this = patching the wrong layer = compounding the problem.

---

## Entry point

**No diagnosis yet** (user just reported something broken):
→ Invoke `investigate` skill first → wait for Debugger Layer report → continue to Step 2

**Already have a Debugger Layer report:**
→ Skip to Step 2 directly

---

## Step 1 — Report raw symptom
Invoke the `debugger` subagent via Agent tool with only what you observed:
- "Test [name] failed with [error]"
- "Output was [X] but expected [Y]"
- "Error at [file/line]"

Do not investigate. Do not theorize. Raw symptom only.

---

## Step 2 — Wait for layer report

| Layer | Meaning |
|-------|---------|
| `SPEC` | Requirement wrong or ambiguous |
| `PLAN` | Wave design wrong |
| `Test` | Test wrong or incomplete |
| `Code` | Implementation wrong |
| `Legacy` | Bug outside current feature scope |

---

## Step 3 — Route based on layer

| Layer | Invoke | Action |
|-------|--------|--------|
| `SPEC` | `architect` | Revise SPEC → cascade to PLAN → Tests → Code |
| `PLAN` | `architect` | Revise PLAN → re-run affected waves |
| `Test` | `tester` | Fix tests → re-run RED |
| `Code` | `implementor` | Fix code → tester confirms GREEN |
| `Legacy` | `architect` | Interrupt Protocol — pause current task |

**Fix at root layer first. Never patch downstream without fixing upstream.**

---

## Step 4 — After fix confirmed GREEN
Write a bug report to `llm-wiki/raw/` with:
- Bug: symptoms observed
- Root cause: Debugger's diagnosis
- Layer: where the fix was applied
- Fix: what changed
- Test: which test now covers this case

Wiki Ingest will read `raw/` and route to the correct wiki section (e.g. `pitfalls/`).

---

## Dispute rule
Layer disagreement after 2 attempts → escalate to user. Do not loop.
