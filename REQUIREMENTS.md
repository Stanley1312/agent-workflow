# REQUIREMENTS — Feature Backlog
> Managed by: Strategist (adds items) + Architect (promotes to active, marks complete)

## Priority Levels
- **P0** — Must have, blocks release
- **P1** — Should have, important
- **P2** — Nice to have, future

---

## Backlog

### P0 — Must Have

- [ ] **Vision MCP server for Ollama** — P0
  - What: Create an MCP server that exposes local Ollama llama3.2-vision image analysis capabilities to Claude Code.
  - Why: The user needs Claude Code to inspect and reason about images using a locally installed vision model.
  - Done when: Claude Code can call the MCP server with an image input and receive a useful text analysis response from Ollama llama3.2-vision.

- [ ] **Image input support for Claude Code workflows** — P0
  - What: Support practical image inputs for analysis tasks, including local image file paths passed from Claude Code to the MCP server.
  - Why: Image analysis is only useful if Claude Code can send screenshots, diagrams, or other local images to the vision model reliably.
  - Done when: A local image path can be provided through an MCP tool call, the image is accepted by the server, and invalid or missing image paths return clear errors.

- [ ] **Ollama connectivity and model validation** — P0
  - What: Validate that the MCP server can reach the local Ollama service and use the installed llama3.2-vision model.
  - Why: Setup failures must be easy to identify before Claude Code attempts image analysis tasks.
  - Done when: The server reports a clear readiness result for Ollama availability and llama3.2-vision availability, including actionable error messages when either is unavailable.

- [ ] **Environment-configurable Ollama vision model** — P0
  - What: Allow the Ollama model name used by the Vision MCP server to be supplied through an environment variable instead of being hardcoded.
  - Why: Users need to switch between locally installed Ollama vision models without editing code or rebuilding the server.
  - Done when: The server reads the model name from a documented environment variable, uses that value for image analysis and readiness validation, and falls back to a clear default or clear startup error when the variable is absent.

### P1 — Should Have

- [ ] **Configurable analysis prompts** — P1
  - What: Allow Claude Code to provide task-specific instructions alongside each image analysis request.
  - Why: Different image analysis tasks require different outputs, such as summarizing a screenshot, extracting UI details, or describing a diagram.
  - Done when: Claude Code can pass custom analysis instructions and the response reflects those instructions rather than using only a fixed generic prompt.

- [ ] **Installation and Claude Code configuration guide** — P1
  - What: Document how to run the MCP server locally and register it with Claude Code.
  - Why: The server must be easy to install, start, and connect after implementation.
  - Done when: A user can follow the guide to start the server, configure Claude Code MCP settings, and complete a basic image analysis request.

- [ ] **Robust error handling for image analysis requests** — P1
  - What: Return clear, structured errors for unsupported files, unreadable files, Ollama request failures, and model failures.
  - Why: Claude Code users need actionable feedback when an image analysis task cannot be completed.
  - Done when: Common failure modes produce human-readable errors without crashing the MCP server.

### P2 — Nice to Have

- [ ] **Multiple image analysis support** — P2
  - What: Allow a single request to analyze more than one image when needed.
  - Why: Some tasks require comparison between screenshots, designs, or before-and-after images.
  - Done when: Claude Code can submit multiple local image paths and receive one coherent analysis that references each image.

- [ ] **Reusable prompt presets** — P2
  - What: Provide predefined prompt modes for common tasks such as screenshot summary, UI review, diagram explanation, and text extraction.
  - Why: Presets reduce repeated prompt writing for common Claude Code image workflows.
  - Done when: Claude Code can select a named preset and receive analysis tailored to that task type.

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

- [x] **Shopping Cart UI** — Completed 2026-05-24
  - What: Two-page luxury watch e-commerce UI (Home + Product Detail)
  - Why: Provide essential browsing and product viewing experience
  - Result: Shopping cart UI with 2 pages (Home + Product Detail), 10 passing tests

- [x] **Workflow initialization** — Completed 2026-05-16
  - What: Setup AI development workflow infrastructure
  - Why: Establish single source of truth for all agents and skills
  - Result: .ai/ structure, all agents, skills, templates in place

---


## Promotion Rule
When Architect picks a feature:
1. Move item from **Backlog** → **In Progress** (change `[ ]` → `[~]`)
2. Create SPEC.md → get user approval → create PLAN.md
3. After ingestion: move to **Completed**, replace `Done when` with `Result`
