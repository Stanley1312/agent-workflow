# Step 4 — Wave Loop

Read `PLAN.md` for the wave list.

## UI/E2E wave — server setup
If the current wave is the UI/E2E wave (last wave, contains Playwright):
Before 4a, invoke `devops`:
> "Set up app server for E2E testing.
> Read playwright config if present.
> Report: 'Server ready' or what failed."

Wait for DevOps to confirm before 4a.

## Parallel waves
Before starting: check PLAN.md for wave dependencies.
- Waves with no shared dependencies → spawn all in one Agent call simultaneously
- Dependent waves → run sequentially

## 4a. RED — Test generation
Invoke `tester`:
> "RED phase for [wave name].
> SPEC: .ai/active/current/SPEC.md
> PLAN: .ai/active/current/PLAN.md
> Write all tests for this wave. Confirm all failing.
> Report: '[N] tests written, all failing'."

Wait for RED confirmed before 4b.

## 4b. Implementation
Check PLAN.md for this wave:

**Parallel Groups present** → spawn one `implementor` per group in a single Agent call:
> "Implement [group tasks] for [wave name].
> SPEC: .ai/active/current/SPEC.md
> PLAN: .ai/active/current/PLAN.md
> Files in scope: [file list]. Do not run tests.
> Report: 'Wave [name] group [X] code complete'."

**Sequential only** → invoke single `implementor`:
> "Implement [wave name].
> SPEC: .ai/active/current/SPEC.md
> PLAN: .ai/active/current/PLAN.md
> STATE: .ai/active/current/STATE.md
> Write code to satisfy failing tests. Do not run tests.
> Report: 'Wave [name] code complete'."

Wait for ALL implementors to complete before 4c.

## 4c. GREEN — Confirmation
Invoke `tester`:
> "GREEN phase for [wave name].
> Run tests. Report 'Wave [name] GREEN' or structured failure list:
> test name + one-line symptom per failing test."

**GREEN →**
1. Write checkpoint to STATE.md: `[date] — Wave [name] GREEN ([N] tests passing)`
2. Update STATE.md wave Summary block (Built / Decisions / Errors hit)
3. Write `llm-wiki/raw/notes/wave-[name]-[feature].md` with same content
4. Run `npx gitnexus analyze` — re-index codebase after code changes
5. More waves remain → next wave (back to 4a)
6. Last wave →
   - Write `All waves GREEN — [date]` checkpoint to STATE.md
   - Set STATE.md `status: COMPLETE`
   - Read `verify.md`

**FAIL →**
1. Do not analyze. Do not touch any file.
2. Invoke `debugger` with failure list (test names + symptoms only)
3. Debugger reports root layer.
   **From this point: orchestrator may only spawn the correct agent and wait.
   Do not read, write, analyze, or fix anything yourself.**
   - Code → invoke `implementor`
   - Test → invoke `tester`
   - Plan → invoke `architect`
   - Environment → invoke `devops`
4. After fix → re-invoke tester GREEN (back to 4c)
5. Same tests fail after 2 full cycles → stop. Report to user: which tests, what was tried.
