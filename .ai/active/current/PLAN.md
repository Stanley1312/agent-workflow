---
feature: Environment-configurable Ollama vision model
created: 2026-05-28
spec_approved: 2026-05-28
---

# PLAN: Environment-configurable Ollama vision model

## Approach

Centralize Ollama vision model resolution so readiness validation, analysis requests, tool output, and structured errors all use the same effective model value. Keep the existing TypeScript/Vitest architecture and dependency injection pattern: tests pass explicit `environment` objects and mocked `fetch` functions, while runtime defaults to `process.env` and `globalThis.fetch`. UI is not in scope, so no DESIGN.md and no UI/E2E wave are required.

All implementors must run the required GitNexus impact analysis before editing any function, class, method, or exported symbol named in this plan, and must report direct callers, affected processes, and risk level before making symbol edits.

---

## Wave 1: Model Configuration

**Goal:** The server resolves one effective Ollama vision model from `OLLAMA_VISION_MODEL`, defaults safely to `llama3.2-vision`, trims configured values, and rejects invalid blank configuration before any Ollama request.
**Dependencies:** None
**Files touched:**
- `src/services/ollamaClient.ts`
- `src/errors.ts`
- `tests/ollamaClient.test.ts`
**Test file:** `tests/ollamaClient.test.ts`

**Tasks:**
- [ ] Tester: add RED tests for AC-1 and AC-2 default behavior proving unset `OLLAMA_VISION_MODEL` uses `llama3.2-vision` for readiness model reporting and `/api/generate` request bodies.
- [ ] Tester: add RED tests for AC-5 proving surrounding whitespace in `OLLAMA_VISION_MODEL` is trimmed before readiness model matching, readiness output, analysis request bodies, and analysis success metadata.
- [ ] Tester: add RED tests for AC-6 proving empty-string and whitespace-only `OLLAMA_VISION_MODEL` return `INVALID_MODEL_CONFIGURATION` and do not call mocked `fetch` for readiness or analysis.
- [ ] Tester: include edge coverage for absent model configuration, configured model happy path, whitespace trimming, empty configured model, and whitespace-only configured model from the SPEC edge case table.

**Parallel Group 1:** (run simultaneously after RED tests are confirmed)
- Implementor A: add the centralized effective-model resolver and invalid-configuration error creation in `src/services/ollamaClient.ts`; run GitNexus impact analysis before editing affected symbols — files: `src/services/ollamaClient.ts`.
- Implementor B: add `INVALID_MODEL_CONFIGURATION` to the stable error code union if tests require centralized error-code support — files: `src/errors.ts`.

**Sequential — depends on Group 1:**
- Implementor: replace hardcoded model reads inside readiness and analysis client paths with the centralized resolver, preserving existing host resolution and typed result shapes — files: `src/services/ollamaClient.ts`.
- Implementor: refactor only as needed to keep functions single-purpose, typed, and under code-quality limits — files: `src/services/ollamaClient.ts`.

---

## Wave 2: Readiness Validation

**Goal:** The readiness path validates the effective configured model against Ollama `/api/tags` and reports the effective model in all success and failure details.
**Dependencies:** Wave 1: Model Configuration
**Files touched:**
- `src/services/ollamaClient.ts`
- `src/tools/checkReadiness.ts`
- `tests/ollamaClient.test.ts`
- `tests/mcpTools.test.ts`
**Test file:** `tests/ollamaClient.test.ts`, `tests/mcpTools.test.ts`

**Tasks:**
- [ ] Tester: extend `tests/ollamaClient.test.ts` with RED tests for AC-3 proving `OLLAMA_VISION_MODEL=llava:latest` is matched against `/api/tags` and reported as the ready model.
- [ ] Tester: extend `tests/ollamaClient.test.ts` with RED tests for AC-7 proving a reachable Ollama response lacking the configured model returns `MODEL_UNAVAILABLE` with details naming the configured model.
- [ ] Tester: extend `tests/ollamaClient.test.ts` with RED tests for host/model composition proving `OLLAMA_HOST=http://127.0.0.1:11435` and `OLLAMA_VISION_MODEL=llava:latest` independently control request URL and model validation.
- [ ] Tester: extend `tests/mcpTools.test.ts` with RED readiness-tool tests proving successful and structured-error MCP responses include the effective configured model, not a duplicate hardcoded default.
- [ ] Tester: include invalid input and boundary coverage from AC-6 for the readiness MCP tool: invalid blank model configuration must produce structured error output and skip Ollama calls.

**Sequential — after RED tests are confirmed:**
- Implementor: update readiness model detection to compare Ollama tags against the resolved effective model instead of the default constant — files: `src/services/ollamaClient.ts`.

**Sequential — depends on readiness client update:**
- Implementor: update readiness failure construction so `OllamaReadinessFailure.model`, `MODEL_UNAVAILABLE.details.model`, and unavailable/invalid configuration details all surface the effective configured model where applicable — files: `src/services/ollamaClient.ts`.
- Implementor: update `checkOllamaReadinessToolHandler` to propagate `readiness.model` in structured error details and remove duplicate hardcoded model reporting — files: `src/tools/checkReadiness.ts`.
- Implementor: refactor readiness helpers only as needed for explicit typed error handling and no silent failures — files: `src/services/ollamaClient.ts`, `src/tools/checkReadiness.ts`.

---

## Wave 3: Analysis and MCP Tool Behavior

**Goal:** Image analysis sends the effective configured model to Ollama `/api/generate`, preserves configured-model failures in structured errors, and exposes tool descriptions that describe configurable model behavior.
**Dependencies:** Wave 1: Model Configuration, Wave 2: Readiness Validation
**Files touched:**
- `src/services/ollamaClient.ts`
- `src/tools/analyzeImage.ts`
- `src/server.ts`
- `tests/ollamaClient.test.ts`
- `tests/mcpTools.test.ts`
**Test file:** `tests/ollamaClient.test.ts`, `tests/mcpTools.test.ts`

**Tasks:**
- [ ] Tester: extend `tests/ollamaClient.test.ts` with RED tests for AC-4 proving `OLLAMA_VISION_MODEL=llava:latest` sends `model: "llava:latest"` in `/api/generate` and reports that model in analysis success metadata.
- [ ] Tester: extend `tests/ollamaClient.test.ts` with RED tests for AC-8 proving generation-time model rejection returns `MODEL_UNAVAILABLE` or `OLLAMA_REQUEST_FAILED` with the configured model name in error details.
- [ ] Tester: extend `tests/mcpTools.test.ts` with RED tests proving the image analysis MCP tool preserves configured model request bodies and structured configured-model errors after local image validation.
- [ ] Tester: extend `tests/mcpTools.test.ts` with RED tests for AC-9 proving registered tool descriptions no longer claim only `llama3.2-vision` can be used and instead reference the configured Ollama vision model behavior.
- [ ] Tester: include edge coverage for configured model unavailable during analysis and tool discovery after configuration change from the SPEC edge case table.

**Parallel Group 1:** (run simultaneously after RED tests are confirmed)
- Implementor A: update analysis request construction and analysis success metadata to use the resolved effective model — files: `src/services/ollamaClient.ts`.
- Implementor B: update model-unavailable and non-model request-failure details so configured model names are included for generation failures — files: `src/services/ollamaClient.ts`.
- Implementor C: update registered and runtime MCP tool descriptions to describe configurable Ollama vision model behavior without hardcoding only the default model — files: `src/server.ts`.

**Sequential — depends on Group 1:**
- Implementor: remove obsolete hardcoded model exports or duplicate constants from MCP tool modules only if no current tests or callers require them; otherwise keep compatibility while ensuring behavior uses the effective model — files: `src/tools/analyzeImage.ts`, `src/server.ts`.
- Implementor: refactor shared model-error detection so it does not rely only on the default model name when interpreting Ollama error text — files: `src/services/ollamaClient.ts`.

---

## Wave 4: Usage Documentation

**Goal:** Users can discover how to set `OLLAMA_VISION_MODEL`, understand the default model, and start the MCP server with another locally installed vision model.
**Dependencies:** Wave 1: Model Configuration, Wave 2: Readiness Validation, Wave 3: Analysis and MCP Tool Behavior
**Files touched:**
- `README.md`
- `tests/mcpTools.test.ts`
**Test file:** `tests/mcpTools.test.ts`

**Tasks:**
- [ ] Tester: add RED documentation coverage for AC-10 proving the usage documentation contains `OLLAMA_VISION_MODEL`, default `llama3.2-vision`, and an example command using another local model such as `llava:latest`.
- [ ] Tester: ensure the documentation test uses domain language and is placed in an existing domain test file without wave-number naming.

**Parallel Group 1:** (run simultaneously after RED documentation test is confirmed)
- Implementor A: update project usage documentation with the environment variable, default value, blank-value behavior, and an example startup command for another locally installed vision model — files: `README.md`.

**Sequential — depends on Group 1:**
- Tester: confirm documentation coverage is GREEN with the rest of the domain suite.

---

## Wave Dependency Graph

Wave 1: Model Configuration -> Wave 2: Readiness Validation -> Wave 3: Analysis and MCP Tool Behavior -> Wave 4: Usage Documentation

**Re-run scope rules:**
| Wave that breaks | Must re-run |
|-----------------|-------------|
| Wave 1: Model Configuration | Wave 1 + Wave 2 + Wave 3 + Wave 4 |
| Wave 2: Readiness Validation | Wave 2 + Wave 3 + Wave 4 |
| Wave 3: Analysis and MCP Tool Behavior | Wave 3 + Wave 4 |
| Wave 4: Usage Documentation | Wave 4 only |

---

## AC Coverage Map

| AC | Wave | Test file |
|----|------|-----------|
| AC-1 | Wave 1: Model Configuration | `tests/ollamaClient.test.ts` |
| AC-2 | Wave 1: Model Configuration; Wave 3: Analysis and MCP Tool Behavior | `tests/ollamaClient.test.ts`; `tests/mcpTools.test.ts` |
| AC-3 | Wave 2: Readiness Validation | `tests/ollamaClient.test.ts`; `tests/mcpTools.test.ts` |
| AC-4 | Wave 3: Analysis and MCP Tool Behavior | `tests/ollamaClient.test.ts`; `tests/mcpTools.test.ts` |
| AC-5 | Wave 1: Model Configuration; Wave 2: Readiness Validation; Wave 3: Analysis and MCP Tool Behavior | `tests/ollamaClient.test.ts`; `tests/mcpTools.test.ts` |
| AC-6 | Wave 1: Model Configuration; Wave 2: Readiness Validation; Wave 3: Analysis and MCP Tool Behavior | `tests/ollamaClient.test.ts`; `tests/mcpTools.test.ts` |
| AC-7 | Wave 2: Readiness Validation | `tests/ollamaClient.test.ts`; `tests/mcpTools.test.ts` |
| AC-8 | Wave 3: Analysis and MCP Tool Behavior | `tests/ollamaClient.test.ts`; `tests/mcpTools.test.ts` |
| AC-9 | Wave 3: Analysis and MCP Tool Behavior | `tests/mcpTools.test.ts` |
| AC-10 | Wave 4: Usage Documentation | `tests/mcpTools.test.ts` |

---

## Verification Gate Coverage

| Verification check | Required outcome |
|--------------------|------------------|
| Domain test suite | Vitest suite passes after all four waves. |
| Linter | Configured lint command passes without `console.log`, dead code, or untyped exported behavior. |
| TypeScript | Project TypeScript build/typecheck passes with strict typing. |
| SPEC coverage | AC-1 through AC-10 have passing tests or documentation assertions mapped above. |
| UI verification | Not applicable because the approved SPEC explicitly excludes UI, dashboard, browser, visual interface, and Playwright UI/E2E coverage. |
| Security check | `OLLAMA_VISION_MODEL` is treated only as data and is never executed as a shell command or logged as part of an environment dump. |
