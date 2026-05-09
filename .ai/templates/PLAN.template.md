---
feature: <!-- from SPEC -->
created: YYYY-MM-DD
spec_approved: YYYY-MM-DD
---

# PLAN: [Feature Name]

## Approach
<!-- 2-3 sentences: implementation strategy and key design choices -->
<!-- Reference specific patterns or libraries found during Architect Prep web search -->

---

<!-- NAMING RULE: Wave names must reflect business domain, not sequence -->
<!-- Good: "Wave 1: User Authentication", "Wave 2: Dashboard Data" -->
<!-- Bad: "Wave 1", "Wave 2", "Wave N" -->

## Wave 1: [Domain Name]

**Goal:** <!-- what this wave achieves in user-facing terms -->
**Dependencies:** None
**Files touched:**
- `src/...`
**Test file:** `src/[domain]/[domain].test.[ext]`

**Tasks:**
- [ ] Tester: write tests for [AC numbers covered by this wave]
- [ ] Implementor: implement [specific thing] to pass tests
- [ ] Implementor: refactor wave

---

## Wave 2: [Domain Name]

**Goal:** <!-- what this wave achieves in user-facing terms -->
**Dependencies:** Wave 1: [Domain Name]
**Files touched:**
- `src/...`
**Test file:** `src/[domain]/[domain].test.[ext]`

**Tasks:**
- [ ] Tester: write tests for [AC numbers covered by this wave]
- [ ] Implementor: implement [specific thing] to pass tests
- [ ] Implementor: refactor wave

---

## Wave N: [Domain Name]

**Goal:** <!-- what this wave achieves in user-facing terms -->
**Dependencies:** Wave 1: [Domain Name], Wave 2: [Domain Name]
**Files touched:**
- `src/...`
**Test file:** `src/[domain]/[domain].test.[ext]`

**Tasks:**
- [ ] Tester: write tests for [AC numbers covered by this wave]
- [ ] Implementor: implement [specific thing] to pass tests
- [ ] Implementor: refactor wave

---

## Wave Dependency GraphWave 1: [Name] ──→ Wave 2: [Name] ──→ Wave N: [Name]

**Re-run scope rules:**
| Wave that breaks | Must re-run |
|-----------------|-------------|
| Wave 1: [Name] | Wave 1 + all downstream waves |
| Wave 2: [Name] | Wave 2 + all downstream waves |
| Wave N: [Name] | Wave N only |

---

## AC Coverage Map

<!-- Architect fills this to confirm every AC from SPEC is covered by at least one wave -->
<!-- Tester uses this to confirm test files match domain, not wave names -->

| AC | Wave | Test file |
|----|------|-----------|
| AC-1 | Wave 1: [Name] | `src/[domain]/[domain].test.[ext]` |
| AC-2 | Wave 1: [Name] | `src/[domain]/[domain].test.[ext]` |
| AC-3 | Wave 2: [Name] | `src/[domain]/[domain].test.[ext]` |