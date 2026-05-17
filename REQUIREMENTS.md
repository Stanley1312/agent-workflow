# REQUIREMENTS — Feature Backlog
> Managed by: Strategist (adds items) + Architect (promotes to active, marks complete)

## Priority Levels
- **P0** — Must have, blocks release
- **P1** — Should have, important
- **P2** — Nice to have, future

---

## Backlog

### P0 — Must Have

### P1 — Should Have

### P2 — Nice to Have

<!-- Item format — Strategist fills this:
- [ ] **[Feature title]** — P[0/1/2]
  - What: [one sentence]
  - Why: [one sentence — the real problem it solves]
  - Done when: [concrete, measurable condition]
-->

---

## In Progress

<!-- Architect moves item here when SPEC is approved + PLAN written -->
<!-- Change [ ] → [~] to mark in progress -->

---

## Completed

<!-- Architect updates entry here after ingestion:
- [x] **[Feature title]** — Completed YYYY-MM-DD
  - What: [one sentence]
  - Why: [one sentence]
  - Result: [what was built, test count, any deviations]
-->

- [x] **Workflow initialization** — Completed 2026-05-16
  - What: Setup AI development workflow infrastructure
  - Why: Establish single source of truth for all agents and skills
  - Result: .ai/ structure, all agents, skills, templates in place

- [x] **Camera Dashboard** — Completed 2026-05-17
  - What: Responsive grid view to monitor up to 10 IP cameras (Imou/Yosee) on home network
  - Why: Need centralized view of all cameras without switching between apps
  - Result: 103 tests passing; MJPEG proxy via OpenCV, RTSP auto-retry, Playwright E2E. Verifier WARN: single.js inlined in template.

---

## Promotion Rule
When Architect picks a feature:
1. Move item from **Backlog** → **In Progress** (change `[ ]` → `[~]`)
2. Create SPEC.md → get user approval → create PLAN.md
3. After ingestion: move to **Completed**, replace `Done when` with `Result`
