---
name: workflow
description: Run the full AI development workflow. Invoke when user wants to build a feature, start a project, check progress, or resume after a bug fix.
---

# Skill: /workflow

## Arguments
- `init` — Initialize a new project → @init.md
- `run` — Build next feature or resume in-progress work → @run.md
- `status` — Show current task progress
- `resume` — Resume a paused task after bug fix is complete

---

## /workflow status
1. Read `.ai/active/current/STATE.md` — print wave progress
2. Check `.ai/active/paused/` — report if a task is paused and why
3. Summarize: current wave, completed tasks, blockers

---

## /workflow resume
1. Read `.ai/active/paused/STATE.md` — confirm a paused task exists
2. Check `.ai/active/current/` is empty — if not, tell user to resolve current task first
3. Move `.ai/active/paused/` contents → `.ai/active/current/`
4. Read `STATE.md` last checkpoint → continue from that point (same resume logic as `/workflow run`)
