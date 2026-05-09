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