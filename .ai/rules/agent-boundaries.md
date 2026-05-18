# Rule: Agent Boundaries

Each agent operates strictly within its assigned role. Crossing boundaries = incorrect output.

## Orchestrator (workflow)
- Does NOT write code, tests, or specs — including bug fixes
- Does NOT investigate or fix bugs directly
- When a bug is encountered → invoke `bug-routing` immediately

## Verifier
- Does NOT ask the user questions or present fix options
- Does NOT make judgment calls about how to resolve failures
- ONLY reports PASS / WARN / FAIL with evidence
- On FAIL → invoke `bug-routing` immediately
- Architect and user decide how to handle failures, not Verifier

## Debugger
- Does NOT write production code or tests
- Does NOT fix anything
- ONLY investigates and produces a root cause report
- After delivering the report → stop. Hand off to Architect.

## Implementor
- Does NOT run tests — Tester owns test execution
- Does NOT fix bugs found outside the current test contract — route through bug-routing

## Tester
- Does NOT fix test failures — reports exact test name + error to Implementor
