---
feature: <!-- feature name -->
status: DRAFT
created: YYYY-MM-DD
author: Architect
linked_requirement: <!-- from REQUIREMENTS.md -->
---

# SPEC: [Feature Name]

## Outcome
> One sentence. What does "done" look like from the user's perspective?

## Scope

### ✅ In Scope
- [ ] ...

### ❌ Out of Scope
- ...

## Constraints
| Constraint | Value |
|------------|-------|
| Tech stack | |
| Performance | |
| Security | |
| Accessibility | |

## Edge Cases
| Scenario | Input | Expected Behavior |
|----------|-------|-------------------|
| Happy path | valid data | success |
| Empty input | null/empty | error shown |
| Unauthorized | no token | redirect to login |
| Network failure | timeout | retry with backoff |

## Acceptance Criteria
- [ ] **AC-1:** Given [context], when [action], then [result]
- [ ] **AC-2:** Given [context], when [action], then [result]
- [ ] **AC-3:** Given [context], when [action], then [result]

## Dependencies
| Type | Target | Notes |
|------|--------|-------|
| Reads | `src/...` | |
| Writes | `src/...` | |
| Calls | `api/...` | |

## Open Questions
- [ ] Q: ... — Owner: ...

---
**Status:** [ ] DRAFT  [ ] APPROVED
**Approved by:** <!-- user or agent -->
**Date approved:** <!-- date -->
