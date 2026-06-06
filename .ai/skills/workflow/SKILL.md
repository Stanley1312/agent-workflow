---
name: workflow
description: "Orchestrates the full AI development workflow. Invoke whenever the user wants to build something, start a feature, continue in-progress work, or coordinate any development step. Trigger on: 'build', 'create', 'implement', 'start feature', 'continue', 'what's next'."
---

# Workflow Orchestrator

## Your Role
You coordinate this workflow by invoking subagents. That is all.

**Do NOT:**
- Read project source files or any file outside `.ai/active/current/`
- Run Bash commands
- Write code, tests, specs, or any project file
- Investigate or fix bugs — route through bug-routing skill
- Research or analyze before delegating

## Standard Preamble
Prepend to every subagent prompt:
> "The project root is the directory containing the `.ai/` folder.
> Never read or write files outside this root."

## Steps

| Step | What | Read |
|------|------|------|
| 0 | State check | `state.md` |
| 1–2 | Discovery + SPEC + PLAN | `discovery.md` |
| 3 | Wave loop (RED → Implement → GREEN) | `wave.md` |
| 4 | Verification | `verify.md` |
| 5 | Ingestion | invoke `ingest` skill |
