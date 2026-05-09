---
id: wiki_agent
description: Build and maintain the persistent LLM wiki (second brain) for this project
compatible-with: [architect, debugger]
triggers:
  - post-task ingestion
  - /workflow init (first run — creates llm-wiki/ structure)
  - on-demand query against accumulated knowledge
---

# Skill: Wiki Agent

## Core Principle
The wiki is a **persistent, compounding artifact**. Knowledge is compiled once and kept current, not re-derived on every query. Cross-references are already resolved. Contradictions are flagged. Synthesis reflects everything accumulated so far.

## Directory Structure
```
llm-wiki/
├── raw/                  # Immutable source documents — never edit, only add
│   ├── sources/          # External documentation (API docs, articles, references)
│   ├── designs/          # Visual assets, system diagrams, UI images
│   ├── notes/            # Quick notes and brain dumps
│   └── history/          # Completed specs and plans (archived by workflow)
└── wiki/                 # LLM-generated markdown files — maintained by this skill
    ├── index.md          # Master catalog of all wiki pages
    ├── log.md            # Append-only chronological record
    ├── architecture/     # System structure documentation
    ├── decisions/        # Context and reasoning ("Why did we do it this way?")
    ├── pitfalls/         # Error experiences, bugs, lessons learned
    └── concepts/         # Core domain logic and technical concepts
```

## Workflows

### Init (run once during `/workflow init`)
Create the full `llm-wiki/` directory structure above.
Then create seed files:
- `wiki/index.md` — empty catalog, ready for first ingest
- `wiki/log.md` — empty log, ready for first entry
Do not create placeholder content. Leave pages empty until real knowledge exists.

### Ingest (run after every completed workflow task)
Called by Architect agent during post-task ingestion:
1. Read archived SPEC, PLAN, STATE from `raw/history/YYYY-MM-DD-[feature]/`
2. Discuss key takeaways — what was built, what decisions were made, what went wrong
3. Write or update pages in appropriate wiki category:
   - Structural changes → `wiki/architecture/`
   - Non-obvious decisions → `wiki/decisions/YYYY-MM-DD-[slug].md`
   - Bugs and lessons → `wiki/pitfalls/[slug].md`
   - Domain concepts surfaced → `wiki/concepts/`
4. Update `wiki/index.md` with new entries
5. Update cross-references on related existing pages using `[[wikilinks]]`
6. Append entry to `wiki/log.md`:
   ```
   ## [YYYY-MM-DD] ingest | [feature name]
   ```

### Query (on-demand — called by Architect or Debugger)
1. Read `wiki/index.md` to find relevant pages
2. Drill into relevant pages
3. Synthesize answer with citations to source pages
4. If the answer is valuable and reusable, file it back into the wiki as a new page

### Lint (periodic health check — called by Architect)
Scan the wiki for:
- Contradictions between pages
- Stale claims superseded by newer sources
- Orphan pages with no inbound links
- Concepts mentioned but lacking their own page
- Missing cross-references
- Data gaps that could be filled from existing raw/ sources

Report findings and suggest fixes. Do not auto-fix without Architect approval.

## Page Conventions

### Every wiki page must have:
```yaml
---
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags: [architecture | decision | pitfall | concept]
---
```
- Clear H1 title
- Internal `[[wikilinks]]` for cross-references to other wiki pages
- Summary table at the bottom linking to related pages

### index.md structure:
- Organized by category (architecture / decisions / pitfalls / concepts)
- Each entry: `[[link]]` | one-line summary | date | source
- Updated on every ingest — never let it go stale

### log.md structure:
- Append-only — never edit past entries
- Entry format:
  ```
  ## [YYYY-MM-DD] ingest | Title
  ## [YYYY-MM-DD] query | Topic
  ## [YYYY-MM-DD] lint | Summary of findings
  ```
- Parseable: `grep "^## \[" log.md | tail -N`

## Responsibilities Split

| Agent (this skill) | Human / Workflow |
|--------------------|-----------------|
| Process all archived specs into wiki | Curate raw/ sources |
| Create and maintain all wiki pages | Direct analysis priorities |
| Keep cross-references consistent | Ask good questions |
| Update index and log on every change | Decide what matters |
| Flag contradictions and suggest connections | Approve lint fixes |
| All bookkeeping | Think about what it all means |

## Integration with Workflow

This skill is invoked at two points in the workflow:

**Point 1 — `/workflow init`**
Architect runs the Init workflow above to create `llm-wiki/` structure.

**Point 2 — Post-task ingestion (Step 5 of every feature cycle)**
Architect runs the Ingest workflow above after archiving `active/current/` to `raw/history/`.
Then runs `npx gitnexus analyze` and `npx gitnexus wiki` to keep the code graph in sync.

**On-demand**
Architect or Debugger can call Query at any time to retrieve accumulated knowledge before writing a SPEC or investigating a bug.
