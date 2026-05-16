---
feature: <!-- feature name -->
status: DRAFT
created: YYYY-MM-DD
author: Architect
linked_requirement: <!-- item from REQUIREMENTS.md -->
---

# SPEC: [Feature Name]

## Outcome
> One sentence. What does "done" look like from the user's perspective?

---

## Scope

### ✅ In Scope
- ...

### ❌ Out of Scope
- ...

---

## Constraints

| Constraint | Value |
|------------|-------|
| Tech stack | <!-- specific versions --> |
| Performance | |
| Security | |
| Accessibility | |

---

## Edge Cases

| Scenario | Input | Expected Behavior |
|----------|-------|-------------------|
| Happy path | valid data | success |
| Empty input | null/empty | error shown |
| Unauthorized | no token | redirect to login |
| Network failure | timeout | retry with backoff |

---

## UX Flows
<!-- DELETE this entire section if backend-only (no UI) -->
<!-- One flow per major user journey. Tester will write one Playwright test per flow. -->
<!-- Every flow must be reachable without manually editing the URL. -->

### Flow 1: [Flow name]
**Role:** [user role performing this flow]
**Entry point:** [URL or action that starts this flow]

1. [Action the user takes]
   → Expected: [what appears or happens]

2. [Next action]
   → Expected: [what appears or happens]

3. [Continue for all steps...]
   → Expected: [what appears or happens]

**Flow pass when:** all steps match expected, no manual URL editing required.
**Flow fail when:** any step redirects wrong, shows blank screen, or element does not respond.

<!-- Duplicate Flow block above for each additional user journey -->

---

## Acceptance Criteria
<!-- Each AC must be testable. Vague ACs will be rejected. -->
<!-- Tester will write one test per AC minimum. -->

- [ ] **AC-1:** Given [context], when [action], then [result]
- [ ] **AC-2:** Given [context], when [action], then [result]
- [ ] **AC-3:** Given [context], when [action], then [result]

---

## Dependencies

| Type | Target | Notes |
|------|--------|-------|
| Reads | `src/...` | |
| Writes | `src/...` | |
| Calls | `api/...` | |

---

## Open Questions
<!-- Resolve all questions before requesting approval -->
<!-- Unresolved questions = DRAFT, cannot be approved -->

- [ ] Q: ... — Owner: ...

---

## Approval

**Status:** [ ] DRAFT  [ ] APPROVED

> Architect: present this SPEC to user and ask:
> "SPEC is ready. Do you approve? Type 'approve' to continue or let me know what needs to change."
>
> When user approves, fill in below and remove this instruction block.

**Approved by:** <!-- user -->
**Date approved:** <!-- date -->