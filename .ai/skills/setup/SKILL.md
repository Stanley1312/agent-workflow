---
name: setup
description: "Initialize all project tooling once at project start: wiki structure, GitNexus index, Playwright browsers. Invoked by workflow init only — not during ingestion."
---

# Skill: Setup

Initializes all third-party tools once when a new project is set up. Run during `/workflow init` only.

---

## Prerequisite: Install tools
Run once on a new machine before starting any project:

### Required
```bash
npm install -g gitnexus        # Code intelligence
npx playwright install         # Browser binaries for UI/E2E
```
Verify: `npx gitnexus --version` · `npx playwright --version`

### Optional — Web search (pick one or more)
```bash
npm install -g mmx-cli         # mmx CLI — requires mmx auth login after install
```
Or configure Tavily MCP in `.mcp.json` (see MCP Setup below).

### Optional — Vision (pick one or more)
Configure Ollama vision MCP in `.mcp.json` (see MCP Setup below).

### MCP Setup
Add MCP servers to `.mcp.json` at project root. Available servers:

**Tavily** (web search):
```json
"tavily": {
  "command": "npx",
  "args": ["-y", "tavily-mcp@latest"],
  "env": { "TAVILY_API_KEY": "tvly-YOUR_KEY_HERE" }
}
```

**Ollama vision** (image analysis — requires Ollama running locally):
```json
"vision-mcp-server-ollama": {
  "command": "node",
  "args": ["./dist/src/server.js"],
  "env": {
    "OLLAMA_HOST": "http://localhost:11434",
    "OLLAMA_VISION_MODEL": "llama3.2-vision:latest"
  }
}
```

---

## Workflow: Init
*Invoked by Architect during `/workflow init`.*

### Step 1 — Wiki
Invoke `wiki` skill Init workflow:
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
