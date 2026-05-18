---
name: web-search
description: "Use mmx CLI to search the web for up-to-date information. Invoke when research is needed: tech stack best practices, library docs, breaking changes, or any information that may be outdated in training data."
---

# Web Search

## Default: mmx CLI
```bash
mmx search query --q "<search term>" --output json --quiet
```

Output là JSON array:
```json
[{ "title": "...", "url": "...", "snippet": "..." }]
```

## Fallback: built-in tools
Nếu mmx không available (chưa install hoặc auth fail) → dùng built-in `WebSearch` và `WebFetch` tools trực tiếp.

## Installation
```bash
npm install -g mmx-cli
mmx auth login
```
Verify: `mmx --version`
