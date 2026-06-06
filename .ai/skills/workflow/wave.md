# Step 4 — Wave Loop

## Parse wave graph

Read `PLAN.md`. For each wave, extract:
- Name
- Dependencies (wave names that must be GREEN first)
- Test file(s) for this wave

## Loop until all waves GREEN

Repeat until every wave is marked GREEN in STATE.md:

1. Find all waves where: **not yet started** AND **all Dependencies are GREEN** in STATE.md (or Dependencies = None)
2. Spawn each ready wave as a full independent pipeline in a single Agent call (simultaneously)

### Per-wave pipeline

#### 4a. RED
Invoke `tester`:
> "RED phase for [wave name].
> SPEC: .ai/active/current/SPEC.md
> PLAN: .ai/active/current/PLAN.md — read only this wave's section
> Test scope: [test file(s) listed for this wave]
> Write tests. Run only these files to confirm all failing.
> Report: '[N] tests written, all failing'."

Wait for RED confirmed before 4b.

#### 4b. Implementation
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
> Write code to satisfy failing tests. Do not run tests.
> Report: 'Wave [name] code complete'."

Wait for ALL implementors to complete before 4c.

#### 4c. GREEN
Invoke `tester`:
> "GREEN phase for [wave name].
> Run only: [test file(s) for this wave]
> Report 'Wave [name] GREEN' or structured failure list:
> test name + one-line symptom per failing test."

**GREEN →**
1. Write checkpoint to STATE.md: `[date] — Wave [name] GREEN ([N] tests passing)`
2. Update STATE.md wave Summary block (Built / Decisions / Errors hit)
3. Write `llm-wiki/raw/notes/wave-[name]-[feature].md` with same content
4. Run `npx gitnexus analyze` — re-index codebase after code changes
5. Wave done → check if any waiting waves are now unblocked → spawn them (back to loop)

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

## UI/E2E wave — server setup
If any ready wave is the UI/E2E wave (contains Playwright):
Before its 4a, invoke `devops`:
> "Set up app server for E2E testing.
> Read playwright config if present.
> Report: 'Server ready' or what failed."

Wait for DevOps to confirm before that wave's 4a.

## After all waves GREEN
- Write `All waves GREEN — [date]` checkpoint to STATE.md
- Set STATE.md `status: COMPLETE`
- Read `verify.md`
