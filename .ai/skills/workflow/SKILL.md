---
name: workflow
description: Run the full AI development workflow. Invoke when user wants to build a feature, start a project, check progress, or resume after a bug fix.
---

# Skill: /workflow

## Arguments
- `init` — Start a brand new project
- `run` — Build the next feature from REQUIREMENTS.md
- `status` — Show current task progress
- `resume` — Resume a paused task after bug fix is complete

---

## /workflow init
Run when starting a brand new project.

1. Load agent `.ai/agents/strategist.md`
2. Load skill `.ai/skills/discuss.md` — governs how the interview is conducted
3. Run discovery interview following discuss.md protocol (intent → assumptions → edge cases → scope)
4. Do NOT proceed until user confirms the synthesis
5. Generate Part 1 of `CLAUDE.md` (Project Overview, Tech Stack, Requirements, Constraints)
6. Load skill `.ai/skills/wiki_agent.md` → run Init workflow to create `llm-wiki/` structure
7. Update `REQUIREMENTS.md` with items surfaced in discovery
8. Update `ROADMAP.md` with initial milestone structure
9. Confirm: "Project initialized. Run `/workflow run` to start your first feature."

---

## /workflow run
Run to start building the next feature.

1. Check `.ai/active/current/` — if files exist, abort and tell user to run `/workflow status`
2. Load agent `.ai/agents/architect.md`
3. Architect reads `REQUIREMENTS.md` → selects highest priority item with user
4. Architect loads `.ai/skills/wiki_agent.md` → Query workflow to load existing system context
5. Architect creates `.ai/active/current/SPEC.md` from `.ai/templates/SPEC.template.md`
6. Present SPEC to user — **do NOT proceed without explicit approval**
7. After approval: Architect creates `.ai/active/current/PLAN.md`

Then for each wave in PLAN.md:

8. Load agent `.ai/agents/tester.md` → write tests for this wave (Red phase)
9. Load agent `.ai/agents/implementor.md` → implement until tests pass (Green + Refactor)
10. Repeat steps 8–9 until all waves complete

Then:

11. Load agent `.ai/agents/verifier.md` → run full verification checklist
12. If verification fails → route to correct agent with failure report → return to step 8 or 9
13. If verification passes → load agent `.ai/agents/architect.md` → run ingestion:
    - Load `.ai/skills/wiki_agent.md` → run Ingest workflow
    - Run `npx gitnexus analyze` — re-index codebase
    - Run `npx gitnexus wiki` — sync wiki docs with updated graph
    - Update `ROADMAP.md` milestone status
14. Archive `active/current/` → `llm-wiki/raw/history/YYYY-MM-DD-[feature]/`
15. Clear `.ai/active/current/`

---

## /workflow status
Show current task progress.

1. Read `.ai/active/current/STATE.md` — print wave progress
2. Check `.ai/active/paused/` — report if a task is paused and why
3. Summarize: current wave, completed tasks, blockers

---

## /workflow resume
Resume a paused task after a bug fix is complete.

1. Confirm `.ai/active/current/` is empty (bug fix was archived)
2. Move `.ai/active/paused/` contents → `.ai/active/current/`
3. Read `STATE.md` to find last checkpoint
4. Continue workflow from that checkpoint
