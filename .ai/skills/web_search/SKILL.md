---
name: web_search
description: Configurable web search. Default uses mmx search, but supports Tavily and other providers. Edit this file to switch providers.
---

# Web Search Skill

## Provider Configuration

This skill uses the MiniMax MMX CLI for web search.

| Provider | Value | Command |
|----------|-------|---------|
| **MiniMax MMX** | `mmx` | `mmx search query --q "<term>" --output json --quiet` |

## Agent Usage

Agents must use Bash to execute the search command:

```bash
mmx search query --q "<search term>" --output json --quiet
```

## JSON Output Format

When using mmx with `--output json --quiet`, the output is a JSON array of search results:

```json
[
  {
    "title": "Result Title",
    "url": "https://example.com",
    "snippet": "Description of the result..."
  },
  ...
]
```

Parse with `jq` or feed directly to downstream tools.

## Installation (for /setup)

```bash
npm install -g mmx-cli
```

**Verify:** `mmx --version && mmx search query --q "test" --output json --quiet`

**Auth:** `mmx auth login` if not already authenticated
