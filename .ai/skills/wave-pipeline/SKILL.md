---
name: wave-pipeline
description: "Run a single wave pipeline autonomously: RED → implement → GREEN. Invoked by the workflow orchestrator once per ready wave, enabling true parallel wave execution. Each executor instance owns exactly one wave and handles it from start to finish without orchestrator coordination."
---

# Executor — Wave Pipeline

You run a single wave from start to finish, independently. The orchestrator spawned you because this wave's dependencies are met — your only job is to complete the wave and report the outcome.

## Inputs (passed by orchestrator)

- **Wave name** and its section from `PLAN.md` (goal, files touched, test files, parallel groups)
- **SPEC path**: `.ai/active/current/SPEC.md`
- **PLAN path**: `.ai/active/current/PLAN.md`

Read the wave section carefully before starting. The test files and file scope listed there define your boundary — do not touch files outside this wave.

## Step 1 — RED

Invoke `tester`:
> "RED phase for [wave name].
> SPEC: .ai/active/current/SPEC.md
> PLAN: .ai/active/current/PLAN.md — read only the [wave name] section
> Test scope: [test file(s) for this wave]
> Write tests. Run only these files to confirm all failing.
> Report: '[N] tests written, all failing'."

Wait for RED confirmed before Step 2.

## Step 2 — Implement

Check the wave section for parallel groups:

**Parallel groups present** → spawn one `implementor` per group in a single call (simultaneously):
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

Wait for all implementors to complete before Step 3.

## Step 3 — GREEN

Invoke `tester`:
> "GREEN phase for [wave name].
> Run only: [test file(s) for this wave]
> Report 'Wave [name] GREEN' or structured failure list:
> test name + one-line symptom per failing test."

## Outcomes

### ✅ GREEN

1. Write to `STATE.md`: `[date] — Wave [name] GREEN ([N] tests passing)`
2. Update STATE.md wave Summary block (Built / Decisions / Errors hit)
3. Write `llm-wiki/raw/notes/wave-[name]-[feature].md` with same content
4. Run `npx gitnexus analyze`
5. Report to orchestrator: `Wave [name] GREEN — [N] tests passing`

### ❌ FAIL

Do not stop at the first failure — most failures are recoverable. Classify before acting.

**Invoke `debugger`** with the failure list (test names + symptoms only).
Debugger identifies the root layer:

**Environment / missing asset** (tool not available, file missing, server not running, optional dependency absent):
- This is not a code bug. Fix the environment, skip the unavailable asset, or work around it.
- Retry immediately — **do not count** against the retry limit.
- Example: image file missing for a visual feature → skip the visual step, implement what's possible.

**Code / Test / Plan bug**:
- Route to the correct agent: Code → `implementor`, Test → `tester`, Plan → `architect`
- After fix → re-run GREEN (back to Step 3)
- **Count as 1 retry cycle**

**Retry limit:** After **3 Code/Plan bug cycles** with no progress (same tests still fail) → stop retrying.
Report to orchestrator: `Wave [name] BLOCKED: [exact failing tests] — [what was tried each cycle]`

The limit exists to prevent infinite loops on genuinely broken specs or plans, not to give up on recoverable failures. Environment issues and missing assets never count — they're expected variations, not structural problems.
