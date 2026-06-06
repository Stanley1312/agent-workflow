---
name: web-search
description: "Search the web for up-to-date information. Invoke when research is needed: tech stack best practices, library docs, breaking changes, or any information that may be outdated in training data."
---

# Web Search

Pick the first available option:

## Option A — Tavily MCP (if available)
If `tavily` MCP tool is in your context:
```
tavily_search({ query: "<search term>" })
```
If quota exceeded → Option B.

## Option B — mmx-cli (if installed)
```bash
mmx search query --q "<search term>" --output json --quiet
```
Output is a JSON array: `[{ "title": "...", "url": "...", "snippet": "..." }]`

## Option C — Native tools (always available)
```
WebSearch({ query: "<search term>" })
```
Or fetch DuckDuckGo directly:
```
WebFetch({ url: "https://html.duckduckgo.com/html/?q=<search+term>" })
```
