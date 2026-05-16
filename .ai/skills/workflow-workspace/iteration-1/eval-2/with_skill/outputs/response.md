# Workflow Skill Evaluation — Response

## 1. What role did the skill assign you?

The skill assigned the role of **Workflow Orchestrator**. Per `SKILL.md`:

> "Your Role: Orchestrator — You coordinate this workflow. You do not write code, tests, or specs yourself."

The orchestrator delegates every task to the correct subagent using the Agent tool. It does not perform any development work directly.

---

## 2. What did you check first?

Per the skill's first instruction:

> "Always check `.ai/active/current/STATE.md` first — if a task is already in progress, resume it before starting anything new."

Following `run.md` Step 1, I checked `.ai/active/current/STATE.md`.

**Result:** The file does **not exist** (as stated in the task assumptions). This means there is no in-progress or paused task. Execution proceeds to Step 2.

---

## 3. Which subagent would you invoke and why?

I would invoke the **`architect`** subagent.

**Reasoning:**

- The user intent is "I want to add user authentication to the existing app" — this maps to "build / create / new feature".
- `SKILL.md` intent mapping table: when REQUIREMENTS.md exists and the intent is "new feature" → first agent is `architect`.
- `run.md` Step 2 confirms: with no active STATE.md, proceed to Step 2 (Select next feature) → invoke `architect`.

The `strategist` would only be invoked if REQUIREMENTS.md did **not** exist. Since REQUIREMENTS.md exists, the architect is the correct first subagent.

---

## 4. What context would you pass to that subagent?

Per `run.md` Step 2, the exact task to pass to `architect` is:

> "Read REQUIREMENTS.md. Present the highest-priority unstarted items to the user. Ask the user to confirm which feature to build next. Report back the selected feature name and its requirements."

**Additional context the orchestrator holds:**

- User expressed intent: "I want to add user authentication to the existing app" — this can be surfaced to the architect as the candidate feature, so it can be matched against REQUIREMENTS.md entries or added if not yet listed.
- No active STATE.md exists, so this is a fresh task start (not a resume).
- After architect reports the selected feature (expected to be user authentication), the orchestrator will proceed to Step 3 (Design phase) and invoke `architect` again for SPEC authoring and user approval.
