# Workflow Skill Evaluation Response

**Task:** "I want to add user authentication to the existing app"
**Assumption:** REQUIREMENTS.md exists, `.ai/active/current/STATE.md` does NOT exist.

---

## 1. Role Assigned by the Skill

The skill assigns the role of **Workflow Orchestrator**. I coordinate the workflow by delegating to subagents — I do not write code, tests, or specs myself.

---

## 2. What I Checked First

Per the skill's instruction ("Always check `.ai/active/current/STATE.md` first"), the first check is `.ai/active/current/STATE.md`.

Following `run.md` Step 1:
- STATE.md does **not** exist → no task is currently in progress
- Proceed to **Step 2**

---

## 3. Which Subagent Would Be Invoked and Why

**Subagent: `architect`**

Reasoning from the intent → agent mapping table in SKILL.md:

| Condition | Match? |
|-----------|--------|
| "build"/"create"/"new project" — no REQUIREMENTS.md | No — REQUIREMENTS.md exists |
| "build"/"create"/"new feature" — REQUIREMENTS.md exists | **YES** — user wants to add auth (a new feature), and REQUIREMENTS.md already exists |

Since REQUIREMENTS.md exists and STATE.md does not, the skill routes to `run.md` Step 2, which invokes the `architect` subagent to select the feature and then Step 3 for design.

The first invocation is the **feature selection** call to `architect`.

---

## 4. Context Passed to the Subagent

**Step 2 — Feature Selection**

Invoke `architect` with:

> "Read REQUIREMENTS.md. Present the highest-priority unstarted items to the user. Ask the user to confirm which feature to build next. Report back the selected feature name and its requirements."

The implicit context for this invocation:
- The user has expressed intent to add user authentication
- REQUIREMENTS.md exists and should contain the backlog
- No active task is in progress (STATE.md absent)

After the architect confirms the selected feature (expected: user authentication), the next invocation would be **Step 3 — Design phase**, passing the architect:

> "Design phase for: user authentication.
> 1. Run your Pre-SPEC Ritual (read llm-wiki/, research stack).
> 2. Write `.ai/active/current/SPEC.md` using `.ai/templates/SPEC.template.md`.
> 3. Present SPEC to user and get explicit approval (hard gate — never skip).
> 4. After approval: create `.ai/active/current/STATE.md` (checkpoint: SPEC APPROVED).
> 5. Create `.ai/active/current/PLAN.md` using `.ai/templates/PLAN.template.md`.
> Report back when SPEC is approved and PLAN is written."
