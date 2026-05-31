# Monitoring Notes

## Issue 1: Workflow quality gates were added too late

The main workflow issue was that the original plan did not make lint/typecheck setup and verification tooling a first-class deliverable early enough.

 What happened is:

  - The workflow pushed us through Discovery → Design → Tests → Implement → Verify.
  - But the plan did not fully include the verification toolchain needed for the final gates.
  - So when Verifier ran eslint and tsc, it exposed missing or mismatched setup late in the process.

  More specifically:

  1. Plan gap
    - The original plan did not clearly require the ESLint config/package setup as a first-class deliverable.
    - It also didn’t make the final typecheck/lint environment an explicit acceptance criterion early enough.
  2. Environment/dependency gap
    - That means the code could be “feature complete” but still fail the workflow’s quality gates.
  3. Workflow sequencing gap
    - The workflow only discovered the missing verification prerequisites after implementation.
    - A stronger workflow would treat lint/typecheck as part of the early contract, not a late verification surprise.

---

## Issue 2: Test execution failed because Vitest was not available locally

E  The workflow forced bug-routing on the failure, and the Debugger identified the first discrepancy as test environment / dependency setup, not
   Code/Test/Plan/Spec. Since the test runner binary was missing, the only way to get back onto the workflow was to restore dependencies first,
   which is why I asked for npm install before retrying the Tester.

---

## Issue 3: Backend-only features still triggered UI verification

The workflow also needs a clearer rule for backend-only projects so it does not run UI/V4 verification when the SPEC and PLAN explicitly say UI is out of scope.

**Why this mattered:**
- This project is a backend-only MCP server.
- The SPEC and PLAN explicitly exclude UI, dashboard, and Playwright work.
- Verifier still attempted a Playwright-based V4 check and reported a failure that was not related to the feature code.

**What this indicates:**
- The workflow needs a scope-aware verification rule.
- If the SPEC/PLAN say no UI, then V4 should be skipped or marked not applicable.
- The final done state should be based on the relevant backend checks only.

**How to watch for it next time:**
- Check the SPEC and PLAN before verification starts.
- If UI is out of scope, do not schedule Playwright or browser checks.
- Mark backend-only features complete once the backend verification gates pass.

---

## Issue 4 : User saw that all the rules are inserted to all agents, although some agents don't  need to know about that rule

## Issue 5: It seems strategist always skip the discovery process (maybe because of the new prompt to skip when user give the requirements)

## Issue 6: Debugger handoff does not hard-block self-editing

After the Debugger identifies the first discrepancy layer, the orchestrator can still drift into fixing the issue itself instead of strictly handing off to the target agent.

**Why this mattered:**
- The workflow says the Debugger should identify the layer and then the orchestrator should route to the correct agent.
- In practice, the handoff was not enforced tightly enough, so the wrong role could continue the fix path.
- That breaks the root-layer separation the workflow is trying to protect.

**What this indicates:**
- The workflow needs a stronger post-Debugger rule.
- After a Debugger result, the orchestrator must not read/edit/write as part of the fix path.
- Only the routed agent should make the change for that layer.

**How to watch for it next time:**
- Add a hard prohibition: after Debugger returns a layer, orchestrator may only spawn the correct agent and wait.
- If the layer is Code, only Implementor may edit.
- If the layer is Test, only Tester may edit.
- If the layer is Plan, only Architect may edit.

## Issue 7: Raw note location is ambiguous and can create unexpected top-level folders

The workflow appears to mix two different storage locations for note artifacts, which can cause agents to create a new top-level `raw/` folder unexpectedly.

**Why this mattered:**
- During wave progress, the workflow instructed agents to write notes under `raw/notes/...`.
- During ingestion/archive, the workflow also referred to `llm-wiki/raw/history/...`.
- Because there was no single canonical location for raw artifacts, a new repo-root `raw/` folder could be created even if that was not the intended long-term structure.

**What this indicates:**
- The workflow has a path-ownership ambiguity for note artifacts.
- It does not clearly define whether wave notes belong in repo-root `raw/`, under `llm-wiki/raw/`, or somewhere inside `.ai/active/current/`.
- Ingestion and active-task note generation are using inconsistent path conventions.

**How to watch for it next time:**
- Define one canonical location for transient wave notes.
- Define one canonical location for ingested/history artifacts.
- Explicitly forbid creating ad-hoc top-level artifact folders outside the approved path scheme.

## Issue 8: ROADMAP milestone status and format are not preserved reliably

The workflow appears to let `ROADMAP.md` drift away from both the actual completed work and the document’s existing format.

**Why this mattered:**
- Only Milestone 1 is marked `Done` even though later milestone work was substantially completed.
- `ROADMAP.md` was also reshaped from its prior format instead of being updated surgically.
- That makes the roadmap less trustworthy as a progress tracker.

**What this indicates:**
- The workflow ties roadmap updates too tightly to the final ingestion/closure step, so if ingestion stalls or becomes mismatched, milestone status can lag behind reality.
- The workflow does not enforce format preservation when Strategist or Architect update `ROADMAP.md`.
- There is no explicit rule saying roadmap updates should be minimal-diff edits to existing milestone structure unless the user asked for a rewrite.

**How to watch for it next time:**
- Separate milestone-progress updates from final ingestion so completed work can update roadmap state earlier.
- Require Strategist/Architect to preserve the existing roadmap format unless the user explicitly asks for restructuring.
- Limit normal roadmap edits to status/focus/blocker fields instead of allowing broad regeneration.
