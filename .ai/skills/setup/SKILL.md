---
name: setup
description: "Initialize all project tooling once at project start: wiki structure, GitNexus index, Playwright browsers. Invoked by workflow init only — not during ingestion."
---

# Skill: Setup

Initializes all third-party tools once when a new project is set up. Run during `/workflow init` only.

---

## Prerequisite: Install tools
Run once on a new machine before starting any project:
```bash
npm install -g gitnexus        # Code intelligence
npm install -g mmx-cli         # Web search
npx playwright install         # Browser binaries for UI/E2E
```
Verify: `npx gitnexus --version` · `mmx --version` · `npx playwright --version`

---

## Workflow: Init
*Invoked by Architect during `/workflow init`.*

### Step 1 — Wiki
Invoke `.ai/skills/wiki/SKILL.md` Init workflow:
- Creates `llm-wiki/` directory structure (`wiki/`, `raw/`, subdirectories)
- Creates seed files: `wiki/index.md`, `wiki/log.md`

### Step 2 — GitNexus
```bash
npx gitnexus analyze
```
Initial codebase index. Required before Architect can use `query` and `context` tools.

### Step 3 — Playwright
```bash
npx playwright install
```
Installs browser binaries for UI/E2E wave. Skip if project has no UI in scope.
