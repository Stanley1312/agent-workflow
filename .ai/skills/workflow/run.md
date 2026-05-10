# /workflow run

> **Prerequisite:** Run `/setup` to install required tools before running.

1. Check `.ai/active/current/` — if files already exist, abort and tell user to run `/workflow status`
2. Load agent `.ai/agents/architect.md`
3. Architect reads `REQUIREMENTS.md` → selects highest priority item with user

### [ARCHITECT PREP — required before writing SPEC]
4. Load `.ai/skills/wiki_agent.md` → run Query workflow to load existing system context
5. Use web search to update knowledge about the relevant tech stack:
   - Current best practices and syntax (e.g. Vue 3 Composition API, not legacy Options API)
   - Breaking changes and version compatibility
   - Known pitfalls for the current stack
   - Common patterns for the type of feature being built

### [SPEC]
6. Architect writes `.ai/active/current/SPEC.md` from `.ai/templates/SPEC.template.md`
7. Architect presents SPEC to user and asks exactly this:
   > "SPEC is ready. Do you approve? Type 'approve' to continue or let me know what needs to change."

   - If user approves (types "approve" / "ok" / "yes" or equivalent) → Architect writes into SPEC.md:
 **Status:** APPROVED
 **Approved by:** user
 **Date:** [today's date]
   - If user requests changes → update SPEC → repeat step 7
   - **Never proceed if SPEC.md does not have status APPROVED**

### [PLAN + STATE]
8. Architect creates `.ai/active/current/STATE.md` from `.ai/templates/STATE.template.md`
   - Write first checkpoint: `SPEC APPROVED — [date]`
   - **Mandatory, cannot be skipped**
9. Architect creates `.ai/active/current/PLAN.md`
   - Each wave must have: domain-based name (e.g. `Wave 1: Authentication`), dependencies, files touched, acceptance criteria
   - **Never use generic names** like "Wave 1", "Wave 2"

### [WAVE LOOP — repeat for each wave in PLAN.md]
10. Load agent `.ai/agents/tester.md`:
    - Read SPEC acceptance criteria for the current wave
    - Write tests organized by domain/business function
    - Confirm all tests are RED (failing) before handoff
    - Report: "[N] tests written, all failing, [Wave name] ready"
    - **Handoff trigger:** when Tester reports this message → immediately load `.ai/agents/implementor.md`

11. Load agent `.ai/agents/implementor.md`:

11. Load agent `.ai/agents/implementor.md`:
    - Green phase: write minimal code for each test in order of **simple → complex**
    - Do NOT run tests — Tester owns test execution
    - Update STATE.md checkpoint after completing the full wave
    - **Retry limit — no exceptions:**
      - Stuck on one test after **3 attempts** → stop, do not retry
      - Escalate to Architect with: which test is blocked, what was attempted, exact error
      - Architect reviews plan, uses web search if needed, provides specific guidance
      - Implementor resumes following Architect's guidance
      - Still stuck after Architect guidance → escalate to user
    - After all wave code written: Refactor within current wave scope only
    - Report: "Wave [name] code complete. Ready for Tester GREEN confirmation."
    - **Handoff trigger:** when Implementor reports this message → immediately load `.ai/agents/tester.md` for GREEN confirmation

11b. Load agent `.ai/agents/tester.md` → confirm GREEN:
    - Run full suite: `pytest src/ --tb=short` — single command only
    - All tests must pass → report: "Wave [name] GREEN — [N] tests passing"
    - Any failures → route back to Implementor with exact test name + error
    - Report: "Wave [name] GREEN — [N] tests passing"
    - **Handoff trigger:** when Tester reports GREEN → proceed to next wave or Verifier

12. Repeat steps 10–11 until all waves in PLAN.md are complete

### [VERIFICATION]
13. Load agent `.ai/agents/verifier.md` → run checklist in order:

    **V1 — Test suite:** 0 failures → PASS | any failures → FAIL

    **V2 — Linter + type check:** 0 errors → PASS | any errors → FAIL | warnings only → WARN

    **V3 — SPEC coverage:** every acceptance criteria has at least one test → PASS | missing → FAIL

    **V4 — UI verification:**
    - Mandatory if project contains any of: `templates/`, `*.html`, `*.jsx`, `*.vue`, `*.svelte`
    - Never self-declare "N/A" if condition above is met
    - Load `.claude/skills/dev/` (Playwright) — click through all major buttons/links, must have visible response
    - No UI files present → genuinely N/A

    **V5 — Security spot check:** injection points, auth bypass, exposed secrets

    **Outcome:**
    | Result | Condition | Action |
    |--------|-----------|--------|
    | ✅ PASS | No FAIL in any step | Proceed to ingestion |
    | ⚠️ WARN | V2 warnings only, no FAIL | Log in STATE.md, proceed to ingestion |
    | ❌ FAIL | Any step returns FAIL | Stop, route to correct agent |

    **Routing on FAIL:**
    - V1 / V3 → Tester or Implementor
    - V2 errors → Implementor
    - V4 → Implementor (fix UI)
    - V5 → Architect reviews SPEC → Implementor fixes code

### [BUG ROUTING — inline]
    When Verifier or user finds a bug during current feature:
    - Load `.ai/agents/debugger.md` → identify root layer (SPEC / PLAN / Test / Code)
    - Layer = SPEC → Architect updates SPEC first → cascade to PLAN → Test → Code
    - Layer = PLAN → Architect updates PLAN → re-run affected waves only
    - Layer = Test / Code → route to Tester / Implementor → re-run that wave
    - **Layer dispute:** fix does not work after 2 attempts → escalate to user, do not self-loop

    When bug is from a LEGACY feature:
    - Architect writes into STATE.md: `status = PAUSED, reason = [bug description]`
    - Move `active/current/` → `active/paused/`
    - Create new bug fix task in `active/current/`
    - Run full 5-step workflow for the bug fix
    - After bug fix ingested → run `/workflow resume`

### [INGESTION]
14. If PASS or WARN → load agent `.ai/agents/architect.md`:
    - Load `.ai/skills/wiki_agent.md` → run Ingest workflow
    - Run `npx gitnexus analyze`
    - Run `npx gitnexus wiki` *(requires LLM API key — skip if not configured)*
    - Update `ROADMAP.md` milestone status
15. Archive `active/current/` → `llm-wiki/raw/history/YYYY-MM-DD-[feature]/`
16. Clear `.ai/active/current/`
17. Confirm: "Feature ingested. Run `/workflow run` to start the next feature."