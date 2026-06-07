# Step 4 — Wave Loop

## Parse wave graph

Read `PLAN.md`. For each wave, extract:
- Name
- Dependencies (wave names that must be GREEN first)
- Test file(s) for this wave

## Loop until all waves GREEN

Repeat until every wave is marked GREEN in STATE.md:

1. Find all waves where: **not yet started** AND **all Dependencies are GREEN** in STATE.md (or Dependencies = None)
2. Spawn one `executor` skill per ready wave in a single Agent call (simultaneously):

> "Run wave pipeline for [wave name].
> Wave section: [paste wave section from PLAN.md]
> SPEC: .ai/active/current/SPEC.md
> PLAN: .ai/active/current/PLAN.md"

3. Wait for all executors to report back
4. For each result:
   - `Wave [name] GREEN` → mark done in STATE.md → check for newly unblocked waves
   - `Wave [name] BLOCKED: [reason]` → stop. Report to user: which wave, which tests, what was tried.

5. If new waves are now unblocked → spawn their executors (back to step 2)
6. All waves GREEN → proceed

## UI/E2E wave — server setup

If a ready wave is the UI/E2E wave (contains Playwright):
Before spawning its executor, invoke `devops`:
> "Set up app server for E2E testing.
> Read playwright config if present.
> Report: 'Server ready' or what failed."

Wait for DevOps to confirm before spawning that wave's executor.

## After all waves GREEN

- Write `All waves GREEN — [date]` checkpoint to STATE.md
- Set STATE.md `status: COMPLETE`
- Read `verify.md`
