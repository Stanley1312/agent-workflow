# Finding Replacement Images

For each image in the design, find a similar free stock photo.
Use search terms from the Image table (subject, tone, aspect ratio).

## Option A — Tavily MCP (if available)
```
tavily_search({ query: "<search terms> site:unsplash.com OR site:pexels.com" })
```

## Option B — mmx-cli (if installed)
```bash
mmx search query --q "<search terms>" --output json --quiet
```

## Option C — Native WebSearch (always available)
```
WebSearch({ query: "<search terms> free stock photo unsplash pexels" })
```

Use Unsplash or Pexels links from results.
Dimensions/aspect ratio must match original — exact subject match not required.
