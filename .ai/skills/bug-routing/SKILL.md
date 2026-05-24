---
name: bug-routing
description: "Mandatory protocol when encountering any bug, test failure, or unexpected behavior. Invoke immediately — before any investigation or fix attempt. Trigger on: test failures, runtime errors, output not matching expectation, V1-V5 verification failures."
---

# Bug Routing Protocol

## ⛔ Hard Rule
No agent may investigate or fix a bug on their own.
Skipping this = patching the wrong layer = compounding the problem.

---

## Step 1 — Invoke debugger with structured symptom only

Pass the structured failure list from Tester — test names and one-line symptoms only.
Do not add analysis, hypotheses, or context about what was recently changed.

---

## Step 2 — Debugger traces the chain bottom-up

Debugger reads each layer and finds where the first discrepancy is:

```
Code: what does the implementation actually do?
  ↑ compare
Test: what is the test asserting?
  ↑ compare
Plan: what did the plan specify for this task?
  ↑ compare
Spec: what does the AC require?
```

Debugger reports: **which layer has the discrepancy** and what it is.
SPEC and REQUIREMENTS are source of truth — if trace reaches them, the layers below misread them.

---

## Step 3 — Route to identified layer

| Layer | Agent | Action |
|-------|-------|--------|
| Code | `implementor` | Fix code to satisfy the test |
| Test | `tester` | Fix test to correctly reflect the spec |
| Plan | `architect` | Revise plan → re-run affected waves |
| Spec ambiguous | — | Stop. Escalate to user. |

Fix at root layer only. Do not patch downstream without fixing upstream first.

---

## Step 4 — Re-enter Step 4c

After fix: orchestrator re-invokes `tester` GREEN. Do not run tests directly.

---

## Loop limit

If the same tests are still failing after **2 full cycles** → stop immediately.
Report to user: which tests, what layer was identified each cycle, what was changed.
Do not loop further.
