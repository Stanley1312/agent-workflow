# Skill Evaluation Response — Old Skill

**Task:** "Build me a todo app with React and SQLite backend"

---

## 1. What role did the skill assign you?

The skill assigned me the role of **Workflow Orchestrator**. Per SKILL.md:

> "You coordinate this workflow. You do **not** write code, tests, or specs yourself. Delegate every task by invoking the correct subagent using the **Agent tool**."

---

## 2. What did you check first?

Per `run.md` Step 1, I checked `.ai/active/current/STATE.md` first to determine if a task is already in progress.

**Finding:** The `.ai/active/current/` directory exists but contains only a `.gitkeep` file — no `STATE.md`. This means no task is currently in progress.

I also checked whether `REQUIREMENTS.md` exists at the project root.

**Finding:** `REQUIREMENTS.md` exists at the project root.

---

## 3. Which subagent would you invoke and why?

I would invoke the **`architect`** subagent.

**Reasoning:**
- The intent is "build" / "create" — a new feature request.
- Per the SKILL.md intent mapping table:
  - `"build", "create", "new feature" — REQUIREMENTS.md exists` → `architect`
- Since `REQUIREMENTS.md` already exists (project is initialized), and there is no in-progress task in `STATE.md`, the workflow proceeds to Step 2 of `run.md`: **Select next feature** using the architect.

If `REQUIREMENTS.md` had not existed, I would have invoked the `strategist` instead.

---

## 4. What context would you pass to that subagent?

Per `run.md` Step 2, I would pass the following task to the `architect` subagent:

> "Read REQUIREMENTS.md. Present the highest-priority unstarted items to the user. Ask the user to confirm which feature to build next. Report back the selected feature name and its requirements."

**Additional context:**
- The user's request was: "Build me a todo app with React and SQLite backend"
- This may already be captured in `REQUIREMENTS.md`, or may need to be added — the architect should check and reconcile the user's stated intent with existing requirements before presenting options.
- Files relevant to the architect: `REQUIREMENTS.md`, `.ai/agents/architect.md`, `.ai/templates/SPEC.template.md`, `.ai/templates/PLAN.template.md`
