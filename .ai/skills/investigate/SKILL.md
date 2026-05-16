---
name: investigate
description: "Investigate root cause of a bug or unexpected behavior. Invoke when user reports a bug, sees unexpected output, or asks why something is broken. Trigger on: 'why is X broken', 'debug this', 'what's causing', 'error in', 'investigate'."
---

# Investigate

Invoke the `debugger` subagent via Agent tool to investigate root cause.

Pass the symptom exactly as described — do not pre-analyze.

---

## What the Debugger investigates

1. Current codebase via GitNexus tools
2. `llm-wiki/wiki/decisions/` — why was this built this way?
3. `llm-wiki/wiki/pitfalls/` — has this happened before?
4. `llm-wiki/raw/history/` — which past SPEC/PLAN touched this area?
5. `.ai/active/current/STATE.md` — which wave last modified the affected files?

## Output

Debugger returns a structured report:
- **Layer:** SPEC / PLAN / Test / Code / Legacy
- **Root cause:** what exactly is wrong
- **Evidence:** where in the codebase

After report → invoke `bug_routing` skill to route the fix.

---

Can be used standalone at any time — no active workflow required.
