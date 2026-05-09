---
name: workflow
description: Run the full AI development workflow. Invoke when user wants to build a feature, start a project, check progress, or resume after a bug fix.
---

# Skill: /workflow

## Arguments
- `init` — Initialize a new project → @init.md
- `run` — Build the next feature from REQUIREMENTS.md → @run.md
- `status` — Show current task progress
- `resume` — Resume a paused task after bug fix is complete

---

## /workflow status
1. Read `.ai/active/current/STATE.md` — print wave progress
2. Check `.ai/active/paused/` — report if a task is paused and why
3. Summarize: current wave, completed tasks, blockers

---

## /workflow resume
1. Confirm `.ai/active/current/` is empty (bug fix has been archived)
2. Move `.ai/active/paused/` contents → `.ai/active/current/`
3. Read `STATE.md` to find last checkpoint
4. Continue workflow from that checkpoint