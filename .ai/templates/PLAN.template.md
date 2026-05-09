---
feature: <!-- from SPEC -->
created: YYYY-MM-DD
spec_approved: YYYY-MM-DD
estimated_total: Xh
---

# PLAN: [Feature Name]

## Approach
<!-- 2-3 sentences: implementation strategy and key design choices -->

---

## Wave 1: [Name]
**Goal:** <!-- what this wave achieves -->
**Dependencies:** none
**Files touched:**
- `src/...`

**Tasks:**
- [ ] Tester: write tests for AC-1
- [ ] Implementor: implement [thing] to pass tests
- [ ] Tester: write tests for AC-2
- [ ] Implementor: implement [thing] to pass tests
- [ ] Implementor: refactor wave 1

---

## Wave 2: [Name]
**Goal:** <!-- what this wave achieves -->
**Dependencies:** Wave 1
**Files touched:**
- `src/...`

**Tasks:**
- [ ] Tester: write tests for AC-3
- [ ] Implementor: implement [thing] to pass tests
- [ ] Implementor: refactor wave 2

---

## Wave N: Edge Cases
**Goal:** Cover all edge cases from SPEC table
**Dependencies:** Wave 1, Wave 2
**Files touched:**
- `src/...`

**Tasks:**
- [ ] Tester: write tests for each edge case row in SPEC
- [ ] Implementor: implement edge case handling
- [ ] Implementor: refactor

---

## Wave Dependency Graph
```
Wave 1 ──→ Wave 2 ──→ Wave N
```
> Re-run scope: if Wave 1 breaks, re-run Wave 1 + Wave 2 + Wave N.
> If Wave 2 breaks, re-run Wave 2 + Wave N only.
