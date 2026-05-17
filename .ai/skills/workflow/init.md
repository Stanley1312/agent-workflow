# /workflow init

> **Prerequisite:** Run `/setup` to install required tools before running.

## Your role
You are the **workflow orchestrator**. Execute this script by invoking subagents. Do not perform any development work yourself.

---

## Step 1 — Discovery

**Invoke the `strategist` subagent** with this task:
> "Run the project initialization discovery interview.
> Read `.ai/skills/workflow/init.md` for the full protocol (questions to ask, synthesis format, output files).
> Output: CLAUDE.md (Part 1), REQUIREMENTS.md, ROADMAP.md.
> Report when complete."

Wait for Strategist to confirm all three files are written before continuing.

---

## Step 2 — Tooling initialization

**Invoke the `architect` subagent** with this task:
> "Initialize all project tooling.
> Read `.ai/skills/setup/SKILL.md` and run the Init workflow (wiki + gitnexus + playwright).
> Report when complete."

Wait for Architect to confirm all tools are initialized before continuing.

---

## Step 3 — Start first feature

Run `/workflow run` to start the first feature from REQUIREMENTS.md.

---

## Discovery Interview Protocol (for Strategist)

This section is read by the Strategist subagent in Step 1.

Interview the user about their project until you have a complete, unambiguous picture of what needs to be built.

Ask one question at a time. Wait for the answer before asking the next. Build each question on what the user just told you.

If the project already has code, explore the codebase first — understand the existing structure, stack, and patterns before asking anything.

### What you must understand before finishing

You cannot proceed until you have clear answers to all of these:

- What does this project do, and who uses it?
- Is this greenfield or already in progress?
- What is the full tech stack — be specific (framework, version, language, runtime)
- Does it need a UI? If yes, is there a design system or will one need to be chosen?
- Does it need authentication? If yes, what method and what provider?
- Does it need a database? If yes, what type, and self-hosted or managed?
- Where will it be hosted?
- Are there any third-party integrations?
- Are there any hard constraints (performance, budget, compliance)?

### How to ask

Go as deep as the answer requires. If the user says "Vue", ask which version. If they say "auth", ask which method. If they say "database", ask which one and whether it's self-hosted. Never assume — always clarify.

If an answer makes another question irrelevant, skip it.

If something is vague, push back: "That's not specific enough — what exactly do you mean by X?"

### Before proceeding

Synthesize everything and present it back:
> "Here is what I understand about your project:
> [key facts, stack, constraints, integrations]
> Is this correct? Anything missing or wrong?"

Do not proceed until the user confirms.

### Output: CLAUDE.md Part 1

Generate into root folder:
```
## Project Overview
[1 paragraph summary — outcomes, not features]

## Tech Stack
[Specific versions, not just names — e.g. "Vue 3.4 + Vite + TypeScript" not "Vue"]

## Specific Requirements
[Bullet list from discovery — concrete, not vague]

## Constraints
[Non-negotiables surfaced in discovery — tech, budget, compliance, timeline]
```

Delete placeholder `src/` folder if it exists after generating CLAUDE.md.
