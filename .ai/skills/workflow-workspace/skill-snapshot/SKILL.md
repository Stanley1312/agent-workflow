---
name: workflow
description: "Orchestrates the full AI development workflow: Discovery → Design → Test → Implement → Verify. Invoke whenever the user wants to build something, start a feature, continue in-progress work, or coordinate any development step. Trigger on: 'build', 'create', 'implement', 'start feature', 'continue', 'what's next', 'run workflow'. Do not trigger for general coding questions or one-off fixes that don't need the full workflow."
license: Proprietary. LICENSE.txt has complete terms
---

# AI Development Workflow

## Your Role: Orchestrator

You coordinate this workflow. You do **not** write code, tests, or specs yourself.

Delegate every task by invoking the correct subagent using the **Agent tool**.
Use the agent name exactly as listed — these match `.claude/agents/<name>.md`.

### Intent → Agent mapping

| User intent | First agent to invoke |
|-------------|----------------------|
| "build", "create", "new project" — no REQUIREMENTS.md exists | `strategist` |
| "build", "create", "new feature" — REQUIREMENTS.md exists | `architect` |
| "test", "run tests" | `tester` |
| "implement", "write code" | `implementor` |
| "verify", "check quality", "done?" | `verifier` |
| "bug", "error", "failing" | invoke `.ai/skills/bug_routing/SKILL.md` |
| "resume", "continue", "what's next" | read STATE.md → follow `@run.md` Resume Logic |

**Always check `.ai/active/current/STATE.md` first** — if a task is already in progress, resume it before starting anything new.

---

## For any build or feature intent → follow `@run.md`
## For project initialization → follow `@init.md`
