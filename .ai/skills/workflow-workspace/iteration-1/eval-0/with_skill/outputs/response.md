# Workflow Skill Evaluation Response

## Task: "Build me a todo app with React and SQLite backend"

---

## 1. Role Assigned by the Skill

The skill assigns the role of **Workflow Orchestrator**. I coordinate the workflow but do not write code, tests, or specs myself. Every task is delegated to the correct subagent.

---

## 2. What I Checked First

The skill mandates: **"Always check `.ai/active/current/STATE.md` first"** before starting anything new.

Findings from that check:
- `.ai/active/current/` directory exists but is **empty** — no STATE.md, no in-progress task.
- `REQUIREMENTS.md` exists at the project root, but its backlog is empty (only placeholder comments, no real features listed).

Since no task is in progress, I proceed to select the next step based on user intent.

---

## 3. Which Subagent Would Be Invoked and Why

**Subagent: `strategist`**

**Why:** The intent mapping in the skill reads:

| User intent | First agent to invoke |
|---|---|
| "build", "create", "new project" — no REQUIREMENTS.md exists | `strategist` |
| "build", "create", "new feature" — REQUIREMENTS.md exists | `architect` |

`REQUIREMENTS.md` technically exists, but it contains **no actual features** — only placeholder template text. The user is asking to build something entirely new ("todo app with React and SQLite backend") with no prior discovery or requirements captured. This is effectively a new project, so the `strategist` is the correct first agent.

Additionally, the `run.md` Step 2 instructs invoking the `architect` to present "highest-priority unstarted items" — but since the backlog is empty, the architect has nothing to present. The right move is to first run discovery via the `strategist` to capture the user's requirements before any design or implementation begins.

---

## 4. Context to Pass to the Subagent

Invoke the `strategist` subagent with this task:

> "Run the project initialization discovery interview.
> Read `.ai/skills/workflow/init.md` for the full protocol (questions to ask, synthesis format, output files).
> The user wants to build a todo app with a React frontend and SQLite backend.
> Use that as a starting point, but interview the user to gather all missing details:
> - Specific React version and build tooling (Vite, CRA, Next.js?)
> - SQLite access method (better-sqlite3, Drizzle ORM, Prisma, raw SQL?)
> - Auth requirements (none? local? OAuth?)
> - Hosting target (local dev only? deployed? where?)
> - Any UI library or design system preference?
> - Any hard constraints (performance, budget, compliance)?
> Synthesize answers and confirm with user before writing output files.
> Output: CLAUDE.md (Part 1), REQUIREMENTS.md, ROADMAP.md.
> Report when complete."
