---
name: setup
description: Install and verify required tools before running the workflow. Use before /workflow run or /workflow init.
---
# Setup: Required Tools
Install these tools before running the workflow. Agents must verify installation before executing tasks.
## 1. GitNexus (Code Intelligence)
```bash
npm install -g gitnexus
```
**Purpose:** Knowledge graph for exploring code relationships, impact analysis, and codebase indexing.
**Verify:** `npx gitnexus --version`
## 2. Playwright (UI Verification)
```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```
**Purpose:** Browser automation for UI verification steps (Verifier Agent).
**Verify:** `playwright-cli --version`
## 3. LLM Wiki (Persistent Knowledge Base)
Read `.llm-wiki/llm_coding_wiki.md` to understand the wiki concept.
If `llm-wiki/` does not exist, CREATE it with this structure:
```
llm-wiki/
├── raw/
│   ├── sources/
│   ├── designs/
│   ├── notes/
│   └── history/
└── wiki/
    ├── index.md
    ├── log.md
    ├── architecture/
    ├── decisions/
    ├── pitfalls/
    └── concepts/
```
**Agents create this structure themselves** — do not defer to `/workflow init`.
## 4. Web Search (mmx-cli)
```bash
npm install -g mmx-cli
```
**Purpose:** Web search for agent research. Default provider in `.ai/skills/web_search/SKILL.md`.
**Verify:** `mmx --version && mmx search query --q "test" --output json`
**Auth:** `mmx auth login` if not already authenticated
