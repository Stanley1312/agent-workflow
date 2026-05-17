---
name: wiki
description: "Build and maintain the project's persistent wiki (llm-wiki/). Invoke during: project initialization (create structure), post-task ingestion (compile completed work into wiki), or on-demand knowledge queries before writing SPEC or investigating bugs."
---

# Skill: Wiki

## Core Principle
The wiki is a **persistent, compounding artifact**. Knowledge is compiled once and kept current, not re-derived on every query. Cross-references are already resolved. Contradictions are flagged. Synthesis reflects everything accumulated so far.

## Directory Structure
```
llm-wiki/
├── raw/                  # Immutable source documents — never edit, only add
│   ├── sources/          # External documentation (API docs, articles, references)
│   ├── designs/          # Visual assets, system diagrams, UI images
│   ├── notes/            # Quick notes, brain dumps, and wave-by-wave learnings
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
Read `.ai/setup/llm_coding_wiki.md` to understand the wiki pattern and conventions.
Create the full `llm-wiki/` directory structure above.
Then create seed files:
- `wiki/index.md` — empty catalog, ready for first ingest
- `wiki/log.md` — empty log, ready for first entry
Do not create placeholder content. Leave pages empty until real knowledge exists.

### Ingest (triggered whenever new sources are in raw/)
Drop any file into `raw/` and run ingest — the agent reads the content and decides where it belongs:
1. Read all new sources from `raw/` — including:
   - `raw/history/YYYY-MM-DD-[feature]/` (SPEC, PLAN, STATE from completed tasks)
   - `raw/notes/` (wave learnings, brain dumps, quick notes)
   - `raw/sources/` (external docs, API references)
2. For each source, synthesize key takeaways and write or update appropriate wiki pages:
   - System structure changes → `wiki/architecture/`
   - Non-obvious decisions → `wiki/decisions/YYYY-MM-DD-[slug].md`
   - Bugs and lessons → `wiki/pitfalls/[slug].md`
   - Domain concepts surfaced → `wiki/concepts/`
3. Update `wiki/index.md` with new entries
4. Update cross-references on related existing pages using `[[wikilinks]]`
5. Append entry to `wiki/log.md`:
   ```
   ## [YYYY-MM-DD] ingest | [source name]
   ```

### Query (on-demand — called by Architect or Debugger)
1. Read `wiki/index.md` to find relevant pages
2. Drill into relevant pages
3. Synthesize answer with citations to source pages
4. If the answer is valuable and reusable, file it back into the wiki as a new page
5. Append to `wiki/log.md`: `## [YYYY-MM-DD] query | [topic]`

### Lint (periodic health check — called by Architect)
Scan the wiki for:
- Contradictions between pages
- Stale claims superseded by newer sources
- Orphan pages with no inbound links
- Concepts mentioned but lacking their own page
- Missing cross-references
- Data gaps that could be filled from existing raw/ sources

Report findings and suggest fixes. Do not auto-fix without Architect approval.
Append to `wiki/log.md`: `## [YYYY-MM-DD] lint | [summary of findings]`

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

## Integration with Workflow

This skill is invoked at three points:

**Point 1 — `/workflow init`**
Architect reads `.ai/setup/llm_coding_wiki.md` then runs the Init workflow to create `llm-wiki/` structure.

**Point 2 — After each wave GREEN**
Implementor/Tester writes wave summary to `raw/notes/wave-[name]-[feature].md`.
Full ingest runs at task completion (Point 3).

**Point 3 — Post-task ingestion (Step 5 of every feature cycle)**
Architect runs the Ingest workflow after archiving `active/current/` to `raw/history/`.
All sources in `raw/` (history + notes + sources) are ingested into the wiki.
Then runs `npx gitnexus analyze` and `npx gitnexus wiki` to keep the code graph in sync.

**On-demand**
Architect or Debugger can call Query at any time to retrieve accumulated knowledge before writing a SPEC or investigating a bug.
