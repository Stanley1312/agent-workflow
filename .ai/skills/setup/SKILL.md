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
npm install -g @gitnexus/dev
npx playwright install chromium
```
**Purpose:** Browser automation for UI verification steps (Verifier Agent).
**Verify:** `npx playwright --version`

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

## Quick Install All
```bash
npm install -g gitnexus @gitnexus/dev
npx playwright install chromium
```

## Verify All
```bash
npx gitnexus --version && npx playwright --version
```
