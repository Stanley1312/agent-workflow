# AI Workflow Project — Session Handoff
> Updated: 2026-06-07 | Use this file to onboard a new Claude session

## What this project is
A **Spec-First, Wiki-Driven, Parallel-Wave-Based** AI development workflow for Claude Code.
The goal: eliminate AI inconsistency and forgetfulness by making `.ai/` the single source of truth for all agents, skills, and workflow logic.

The workflow orchestrates discovery, technical design, test generation, implementation, and verification through a team of specialized agents, with true parallel wave execution via the executor agent.

---

## Collaboration rules
- Chat: **tiếng Việt**
- File content: **tiếng Anh**
- User pastes full file → Claude returns full corrected file (không gửi diff riêng)
- Không regenerate file nếu user chưa paste nội dung hiện tại

---

## Core architecture principles

### `.ai/` = single source of truth
- All agent behavior defined in `.ai/agents/[name].md`
- All skill logic defined in `.ai/skills/[name]/SKILL.md`
- `.claude/` contains thin wrappers that point to `.ai/`
- No behavior duplication — the wrapper just redirects

### Workflow structure
- **Modular skills under `.ai/skills/workflow/`**: `state.md`, `discovery.md`, `wave.md`, `verify.md`
- **Executor agent** spawns parallel wave executors — true parallelism via independent agents
- **Bug routing** is a cross-cutting concern — all agents route failures through it
- No agent investigates/fixes bugs independently — hard rule via `.ai/rules/no-self-fix.md`

### Chain of Truth
```
SPEC → PLAN → Tests → Code
```
Always fix at the root layer and cascade down.

---

## File structure (current)
```
project-root/
├── CLAUDE.md                        ← Project overview + tech stack (Part 1)
│
├── .claude/
│   ├── full_workflow.md             ← Flow reference (not source of truth)
│   ├── agents/                      ← Wrappers pointing to .ai/agents/
│   │   ├── strategist.md
│   │   ├── architect.md
│   │   ├── tester.md
│   │   ├── implementor.md
│   │   ├── verifier.md
│   │   ├── debugger.md
│   │   ├── devops.md
│   │   └── executor.md
│   └── skills/
│       ├── workflow/SKILL.md        ← Wrapper
│       ├── gitnexus/                ← Auto-installed
│       └── dev/                     ← Auto-installed: playwright
│
├── .ai/                             ← SINGLE SOURCE OF TRUTH
│   ├── agents/
│   │   ├── strategist.md            ← Product manager
│   │   ├── architect.md             ← Tech lead
│   │   ├── tester.md                ← QA engineer
│   │   ├── implementor.md           ← Developer (haiku model)
│   │   ├── verifier.md              ← Quality gate
│   │   ├── debugger.md              ← Root cause investigator
│   │   ├── devops.md                ← Environment setup
│   │   └── executor.md              ← Wave pipeline executor
│   ├── skills/
│   │   ├── workflow/
│   │   │   ├── SKILL.md             ← Orchestrator entry point
│   │   │   ├── state.md             ← State check logic (Step 0)
│   │   │   ├── discovery.md         ← Discovery + SPEC + PLAN (Steps 1-2)
│   │   │   ├── wave.md              ← Wave loop + parallel execution (Step 3)
│   │   │   └── verify.md            ← Verification protocol (Step 4)
│   │   ├── ingest/SKILL.md          ← Post-feature archival + wiki update
│   │   ├── wave-pipeline/SKILL.md   ← Executor wave pipeline
│   │   ├── vision/SKILL.md          ← UI design image analysis
│   │   ├── web-search/SKILL.md      ← Multi-fallback web search
│   │   ├── setup/SKILL.md           ← Project initialization
│   │   ├── discuss/SKILL.md         ← Deep discussion skill
│   │   └── debug/SKILL.md           ← Debug & investigation
│   ├── active/
│   │   ├── current/                 ← Running task (SPEC, PLAN, STATE, DESIGN)
│   │   └── paused/                  ← Paused task during legacy bug fix
│   ├── rules/
│   │   ├── no-self-fix.md           ← Hard rule: all bugs routed through bug-routing
│   │   ├── agent-boundaries.md      ← Role separation enforcement
│   │   ├── code-quality.md          ← Function/naming/error standards
│   │   └── testing-conventions.md   ← Test naming + domain-based organization
│   └── templates/
│       ├── SPEC.template.md         ← Approval gate, edge cases, acceptance criteria, UX flows
│       ├── PLAN.template.md         ← Waves with dependencies, task lists, AC coverage map
│       ├── STATE.template.md        ← Checkpoint tracking per wave
│       └── DESIGN.template.md       ← UI design system (colors, typography, components)
│
├── llm-wiki/
│   ├── wiki/
│   │   ├── index.md                 ← Wiki root
│   │   ├── shipped.md               ← Append-only: completed features
│   │   ├── architecture/            ← System design docs
│   │   ├── decisions/               ← ADRs and rationale
│   │   └── pitfalls/                ← Known gotchas + mistakes
│   └── raw/
│       ├── history/                 ← Archived SPEC/PLAN/STATE per feature
│       └── notes/                   ← Wave execution notes (wave-[name]-[feature].md)
│
└── SESSION_HANDOFF.md               ← This file
```

---

## The 8 Agents

| Agent | Model | Tools | Role |
|-------|-------|-------|------|
| Strategist | opus | Read, Write | Discovery interview → SPEC → approval gate |
| Architect | opus | Read, Write, Edit, Bash, Glob, Grep | SPEC → PLAN, escalation handler, ingestion |
| Tester | sonnet | Read, Write, Edit, Bash, Glob, Grep | RED phase (tests), GREEN phase (confirmation), Playwright for UI/E2E |
| Implementor | haiku | Read, Write, Edit, Glob, Grep | Code to satisfy tests (NO Bash — enforces test ownership) |
| Verifier | sonnet | Read, Bash, Glob, Grep | Quality gate V1-V5, routes failures through bug-routing |
| Debugger | opus | Read, Bash, Glob, Grep | Root cause analysis only — no code writing |
| DevOps | haiku | Read, Bash | Environment setup, dependency install, server management |
| Executor | sonnet | Read, Write, Edit, Bash, Glob, Grep | Runs single wave pipeline independently (RED → Implement → GREEN) |

**Key design:**
- Implementor has NO Bash tool → enforces "Tester owns test execution" at tool level
- Executor is the enabler of true parallel waves — orchestrator spawns one per ready wave simultaneously
- All 8 agents route bugs through `bug-routing` skill — no self-fixing allowed

---

## The Golden Loop

```
Step 0: Check state
      ↓
Step 1: Discovery (Strategist)  ─→ writes SPEC
      ↓
Step 2: Design & PLAN (Architect)  ─→ writes PLAN + STATE + DESIGN (if UI)
      ↓
Step 3: Wave loop (RED → Implement → GREEN)
        ├─ Invoke Executor per ready wave (spawn all simultaneously)
        │  └─ Each Executor: Tester RED → Implementor GREEN → Tester GREEN confirmation
        ├─ After all GREEN: mark in STATE.md
        └─ Continue until all waves GREEN
      ↓
Step 4: Verification (Verifier)  ─→ V1-V5 checklist
      ↓
Step 5: Ingestion (Architect + wiki skill)  ─→ Archive + update llm-wiki/ + shipped.md
      ↓
active/current/ cleared → loop ready for next feature
```

---

## Parallel Wave Execution (NEW)

### Executor Agent
Spawned by the orchestrator once per ready wave, running independently:

**Inputs:**
- Wave section from `PLAN.md` (name, goal, dependencies, files, test files)
- SPEC and PLAN paths

**Execution:**
1. **RED** — invoke Tester, confirm tests fail
2. **Implement** — check for parallel groups in wave:
   - If parallel groups exist → spawn multiple Implementors (one per group, simultaneously)
   - Else → spawn single Implementor
3. **GREEN** — invoke Tester, confirm tests pass or report failures

**Output:**
- `Wave [name] GREEN — [N] tests passing` → orchestrator marks wave complete
- `Wave [name] BLOCKED: [exact failing tests]` → orchestrator routes to debugger

**Failure handling:**
- Invoke debugger to identify root layer (code/test/plan/environment)
- Fix at root layer, retry → count against retry limit
- Environment issues (missing file, server down) do not count as retries
- After 3 structural bug fix cycles with no progress → report BLOCKED

### True Parallelism
Multiple ready waves run simultaneously — each Executor owns exactly one wave, no interference.
Waves with dependencies wait in queue until predecessors GREEN.

---

## PLAN Format — Parallel Groups

Each wave can declare parallel execution groups:

```markdown
## Wave 1: [Name]

**Parallel Group 1** (run simultaneously):
- Implementor A: [task] — files: [...]
- Implementor B: [task] — files: [...]

**Sequential — depends on Group 1:**
- Implementor: [task] — files: [...], requires output from Group 1
```

If all tasks are independent → single parallel group containing all tasks.
Orchestrator sees `Wave [name] — Parallel Group N` in PLAN and spawns N executors.

---

## UI/E2E Wave Design

### When triggered
SPEC contains UX Flows → PLAN must designate a final "UI/E2E" wave.

### UX Flow Format
Defined in SPEC by Architect. Used by Tester as Playwright script. Used by Verifier as browser checklist.

```markdown
### Flow N: [Flow name]
**Role:** [user role]
**Entry point:** [URL or action]

1. [Action] → Expected: [what appears]
2. [Next action] → Expected: [what appears]

**Flow pass when:** all steps match expected, no manual URL editing required.
**Flow fail when:** any step redirects wrong or element unresponsive.
```

### Architect responsibility
- Read `.ai/skills/vision/SKILL.md` if design images exist
- Generate `active/current/designs/[screen-name].md` for each screen
- Write DESIGN.md containing design system (colors, typography, spacing, components)
- Include UI/E2E wave as **final wave** in PLAN — depends on all previous waves GREEN

### Tester responsibility (UI/E2E wave)
- One Playwright test file per UX Flow: `src/e2e/[flow-name].spec.ts`
- Each test translates SPEC steps → `await` statements + `expect()` assertions
- RED: all Playwright tests fail
- GREEN: all Playwright tests pass

### Implementor responsibility (UI/E2E wave)
- Read DESIGN.md before writing any UI code
- Implement components/pages to match design system exactly (colors, fonts, spacing)
- No speculative UI — only code needed to pass Playwright tests

### Verifier responsibility (V4 — UI Verification)
**Step 4a:** Run `npx playwright test` — automation suite must pass
**Step 4b:** Open real browser → manually follow each UX Flow from SPEC step-by-step
**Step 4c:** Compare screenshots against design files (if `active/current/designs/` exists)
**Step 4d:** Confirm every UX Flow in SPEC has a Playwright test

---

## Vision Skill — UI Design Analysis

When SPEC includes UI scope, Architect uses `vision` skill to extract design from images.

**Fallback chain** (try each in order):
1. **Ollama vision MCP** — fast, offline, requires local Ollama running
2. **mmx-cli** — feature-complete, requires mmx API key
3. **Native Read tool** — always available, Claude views images directly

**Output:** Structured UI analysis saved to `active/current/designs/[screen-name].md`:
- Layout map (sections, columns, rows)
- Color palette (hex codes, roles)
- Typography (fonts, sizes, weights)
- Components (names, styles, positions)
- Images (descriptions, aspect ratios)
- Interactive elements (clickable areas, labels)
- Content/copy (exact text)

---

## Web Search Skill — Multi-Fallback

When Architect needs to research tech stack, breaking changes, or library docs.

**Fallback chain** (try each in order):
1. **Tavily MCP** — if configured, most comprehensive
2. **mmx-cli** — if installed, `mmx search query --q "<term>" --output json`
3. **Native tools** — WebSearch + WebFetch always available

Returns JSON array: `[{ "title": "...", "url": "...", "snippet": "..." }]`

---

## Skill: Ingest — Post-Feature Closure

Invoked after Verifier reports PASS or WARN.

**Steps:**
1. Read STATE.md + SPEC.md (feature name, what was built, test count)
2. Archive: copy `active/current/` → `llm-wiki/raw/history/YYYY-MM-DD-[feature]/`
3. Clear `active/current/` (directory stays)
4. Invoke `wiki` skill — reads `llm-wiki/raw/`, updates `llm-wiki/wiki/`
5. Append to `llm-wiki/wiki/shipped.md`:
   ```
   ## [feature name] — [YYYY-MM-DD]
   - **What:** [one sentence]
   - **Tests:** [N] passing
   - **Deviations:** [from SPEC, or "none"]
   ```
6. Run `npx gitnexus wiki` to update codebase docs
7. Report: Ingestion complete + archived path + wiki updated

---

## Bug Routing — Hard Rule

**Entry:** Any agent encounters a bug, test failure, or unexpected behavior.
**Action:** Stop immediately → invoke `bug-routing` skill with raw symptom only.
**Debugger:** Identifies root layer (SPEC / PLAN / Test / Code / Environment / Legacy).
**Route:**
- SPEC → Architect (update SPEC, cascade)
- PLAN → Architect (update PLAN, re-run affected waves)
- Test → Tester (fix test, re-run RED)
- Code → Implementor (fix code, Tester confirms GREEN)
- Environment → DevOps (fix tooling, retry)
- Legacy → Architect (Interrupt Protocol)

**Key:** Invoking agent only reports raw symptom. Debugger collects full context and assigns layer.

---

## Interrupt Protocol (Legacy Bug)

When Debugger reports a legacy bug (not in current feature):

1. **Architect:** Set `active/current/STATE.md` status = PAUSED + reason
2. **Architect:** Move `active/current/` → `active/paused/`
3. **Architect:** Create new SPEC/PLAN for bug fix in `active/current/`
4. **Full workflow:** Run discovery → design → waves → verification for bug fix
5. **After ingestion:** Invoke `workflow` skill — `state.md` auto-detects `active/paused/` and restores

No manual resumption step needed — single `/workflow` invocation handles it.

---

## Setup Skill — Project Initialization

Runs once at project start.

**Prerequisites (machine-wide):**
```bash
npm install -g gitnexus        # Code intelligence
npx playwright install         # Browser binaries
npm install -g mmx-cli         # (Optional) web search + vision
```

**Init steps (per project):**
1. **Wiki:** Create `llm-wiki/` structure (wiki/, raw/, subdirectories, seed files)
2. **GitNexus:** Run `npx gitnexus analyze` to index codebase
3. **Playwright:** Run `npx playwright install` if project has UI in scope

**Optional MCP setup** (add to `.mcp.json`):
- **Tavily** (web search) — requires API key
- **Ollama vision** (image analysis) — requires local Ollama running

---

## Rules (Enforced)

### No Self-Fix (`.ai/rules/no-self-fix.md`)
No agent investigates or fixes bugs independently. All bugs route through `bug-routing`.

### Agent Boundaries (`.ai/rules/agent-boundaries.md`)
- **Orchestrator:** No code, tests, specs, bug investigation
- **Verifier:** Only reports PASS/WARN/FAIL with evidence, routes failures through bug-routing
- **Debugger:** No code writing, only produces root cause report + hands off
- **Implementor:** No test running, no bug fixing outside current wave test contract
- **Tester:** No test fixing, only reports exact names + errors to Implementor

### Code Quality (`.ai/rules/code-quality.md`)
- Functions < 40 lines, single responsibility
- Full words in names (no abbreviations)
- No magic numbers — use named constants
- Explicit error handling, typed parameters + returns
- No `console.log`, no TODO comments, no dead code, no speculative code

### Testing Conventions (`.ai/rules/testing-conventions.md`)
- Test file name = domain being tested (not wave name)
- Never include "wave" or wave numbers in file names
- Test name = BDD format: `describe("[domain]")`, `it("should [behavior] when [condition]")`
- Coverage: happy path + edge case + invalid input + boundary per AC

---

## Known Issues / Pending Work

### 1. `/workflow resume` merged into `/workflow run` — PARTIALLY DONE
Current: `state.md` Step 1 still has old branch telling user to run `/workflow resume`.
Should: Auto-detect PAUSED state → restore automatically (no manual step).

**Fix:** Update `state.md` Step 1:
```markdown
Has files, no STATE.md OR PAUSED status
→ Auto-restore: move active/paused/ → active/current/, find last checkpoint, go to Resume Table
```
Remove `/workflow resume` section from SKILL.md.

### 2. Skill optimization — all skills need triggering tuning
Scope: `.ai/skills/` + `.claude/agents/` descriptions for better auto-trigger accuracy.
Priority issues: `web-search`, `vision`, `discuss`, `debug`, `setup` descriptions too vague or incomplete.

---

## Session checkpoints

When continuing from another session:

1. **Read this file first** — it's the hand-off
2. **Check state:** Read `active/current/STATE.md` if it exists
   - If PAUSED → auto-restore from `active/paused/` (via `state.md` logic)
   - If IN_PROGRESS → continue from last checkpoint
   - If COMPLETE → check ingestion checklist
3. **Understand the tech stack:** Read `CLAUDE.md` Part 1
4. **For deep exploration:** See `.claude/skills/gitnexus/` for code intelligence
5. **On bug report:** Invoke `bug-routing` immediately — no investigation first
6. **Next feature:** Start fresh with `/workflow` → discovery → SPEC approval → PLAN

---

## Quick reference — how to...

| Task | Who | Where |
|------|-----|-------|
| Start a new feature | Strategist | Invoke `/workflow` → discovery.md |
| Write SPEC | Strategist | `.ai/templates/SPEC.template.md` |
| Approve SPEC | User | User types "approve" or edit request |
| Design PLAN | Architect | `.ai/templates/PLAN.template.md` → Pre-PLAN Ritual |
| Analyze design image | Architect | Invoke `vision` skill |
| Write tests (RED) | Tester | Domain-based test files (no wave names) |
| Implement code | Implementor | Current wave scope only, no test running |
| Run test suite | Tester | Wave-scoped only (per-wave, not full suite) |
| Final verification | Verifier | V1-V5 checklist → V4 includes Playwright |
| Root cause analysis | Debugger | Via `bug-routing` skill only |
| Archive feature | Architect | Via `ingest` skill |
| Web search | Architect | Invoke `web-search` skill (fallback chain) |
| Fix environment | DevOps | Dependency preflight + server setup |

---

## Design decisions (do not re-litigate)

| Decision | Rationale |
|----------|-----------|
| Executor agent + parallel waves | Reduce wall-clock time via simultaneous independent wave execution |
| `.ai/` = single source of truth | No behavior duplication; wrappers only redirect |
| Vision fallback chain | Accommodate multiple tools (Ollama offline, mmx online, native always available) |
| Web search fallback chain | Tavily (preferred) → mmx-cli → native tools |
| bug-routing as separate skill | Cross-cutting concern, no single agent owner. Good description = auto-trigger |
| Tester owns ALL test execution | RED and GREEN, verifier re-run, wave-scoped execution |
| Implementor no Bash | Enforces test ownership at tool level, not just rule level |
| UI/E2E wave always last | Playwright needs full app — can't write E2E until all domain waves done |
| PLAN parallel groups | Some waves can safely split into independent executable groups |
| shipped.md append-only | Immutable feature log, never edited retroactively |
| State auto-restore | `/workflow run` detects PAUSED, restores automatically — one command |
| Ingest post-verification | Archive + wiki update only after PASS/WARN, not before |

---

## How to continue

```
Tôi đang xây dựng một AI development workflow cho Claude Code.
Đọc SESSION_HANDOFF.md trước, sau đó giúp tôi tiếp tục.
```

Next priorities:
1. **Fix state.md Step 1** — auto-restore PAUSED status (remove manual `/workflow resume` instruction)
2. **Skill triggering tuning** — refine descriptions for better auto-trigger via skill-creator
3. **Test real parallel wave execution** — verify multiple executors run simultaneously without conflict
