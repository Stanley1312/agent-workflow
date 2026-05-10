---
name: web_search
description: Configurable web search skill using the MiniMax MMX CLI.
---

# Web Search Skill

## Provider Configuration

This skill uses the MiniMax MMX CLI for web search.

| Provider | Value | Command |
|----------|--------|---------|
| **MiniMax MMX** | `mmx` | `mmx search query --q "<term>" --output json` |

## Current Provider

```bash
PROVIDER=mmx
````

## Agent Usage

Agents must use Bash to execute search queries.

```bash
mmx search query --q "<search term>" --output json
```

## Installation (for `/setup`)

### Install MMX CLI

```bash
npm install -g mmx-cli
```

### Authenticate

```bash
mmx auth login
```

Or authenticate with an API key:

```bash
mmx auth login --api-key sk-xxxxx
```

### Verify Installation

```bash
mmx --version
mmx auth status
mmx search query --q "test" --output json
```

## Notes

* MMX CLI requires Node.js 18 or later.
* JSON output is recommended for agent workflows.
* Official documentation:

  * https://platform.minimax.io/docs/token-plan/minimax-cli
  * https://github.com/MiniMax-AI/cli

```
```
