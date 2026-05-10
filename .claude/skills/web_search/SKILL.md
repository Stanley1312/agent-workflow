---
name: web_search
description: Configurable web search. Default uses mmx search, but supports Tavily and other providers. Edit this file to switch providers.
---

# Web Search Skill

## Provider Configuration

Edit the `PROVIDER` variable below to switch between web search providers:

| Provider | Value | Command |
|----------|-------|---------|
| **mmx (default)** | `mmx` | `mmx search query --q "<term>"` |
| **Tavily** | `tavily` | `tavily search "<term>"` |

## Current Provider

```
PROVIDER=mmx
```

## Agent Usage

Agents must use Bash to execute the configured search command:

```bash
# When PROVIDER=mmx (default)
mmx search query --q "<search term>" --output json

# When PROVIDER=tavily
tavily search "<search term>"
```

## Provider Switching

To switch providers:

1. Change the `PROVIDER` value at the top of this file
2. Install the new provider's CLI if not already installed:
   - mmx: `npm install -g @minimax-ai/mmx-cli`
   - Tavily: `npm install -g tavily`
3. Authenticate if needed (`mmx auth login` for mmx)
4. Verify with a test search

## Installation (for /setup)

```bash
npm install -g @minimax-ai/mmx-cli
```

**Verify:** `mmx --version && mmx search query --q "test" --output json`

**Auth:** `mmx auth login` if not already authenticated
