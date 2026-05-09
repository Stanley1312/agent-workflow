---
name: debug
description: Investigate root cause of any bug or unexpected behavior. Invoke when user reports a bug, sees unexpected output, or asks why something is broken.
---

# Skill: /debug

Load agent `.ai/agents/debugger.md` and begin root cause investigation.

## Protocol

1. Load agent `.ai/agents/debugger.md`
2. Gather initial context from the symptom description
3. Run investigation across all sources:
   - Current codebase via GitNexus MCP tools
   - `llm-wiki/wiki/decisions/` — why was this built this way?
   - `llm-wiki/wiki/pitfalls/` — has this happened before?
   - `llm-wiki/raw/history/` — which past SPEC/PLAN touched this area?
   - `.ai/active/current/STATE.md` — which wave last modified the affected files?
4. Determine root cause layer (SPEC / PLAN / Test / Code / Legacy)
5. Output structured report per debugger agent format

## Usage
```
/debug login fails silently when email has uppercase letters
/debug API returns 500 on /users endpoint after last deployment
/debug tests pass but UI shows wrong data after form submit
```

Can be used standalone at any time — no active workflow required.
After debugging, bring the report to Architect to decide next steps.
