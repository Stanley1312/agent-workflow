---
feature: Environment-configurable Ollama vision model
status: APPROVED
created: 2026-05-28
author: Architect
linked_requirement: Environment-configurable Ollama vision model
---

# SPEC: Environment-configurable Ollama vision model

## Outcome
> Users can switch the Vision MCP server between locally installed Ollama vision models by setting an environment variable instead of editing code or rebuilding the server.

---

## Scope

### In Scope
- Define and document a single environment variable, `OLLAMA_VISION_MODEL`, for the Ollama vision model name.
- Use the configured model name for image analysis requests sent to Ollama `/api/generate`.
- Use the configured model name for readiness/model validation against Ollama `/api/tags`.
- Keep `llama3.2-vision` as the clear default model when `OLLAMA_VISION_MODEL` is absent.
- Trim whitespace around `OLLAMA_VISION_MODEL` values before use.
- Return clear structured errors when `OLLAMA_VISION_MODEL` is present but empty or whitespace-only.
- Surface the effective model name in readiness success, readiness failure details, analysis success metadata, and model-unavailable errors.
- Update automated tests for model configuration, readiness validation, analysis requests, and MCP tool responses.
- Document `OLLAMA_VISION_MODEL`, its default, and example usage for changing local vision models.

### Out of Scope
- Installing, pulling, or recommending specific Ollama models automatically.
- Validating whether a configured model is actually vision-capable beyond checking local Ollama model availability.
- Supporting per-request model selection through MCP tool input.
- Supporting multiple configured fallback models or model preference lists.
- Changing `OLLAMA_HOST` behavior except where tests need to prove host and model configuration compose correctly.
- Changing image path validation, image formats, prompt behavior, or multi-image support.
- Building any browser UI, dashboard, visual interface, or Playwright UI/E2E coverage.

---

## Constraints

| Constraint | Value |
|------------|-------|
| Tech stack | Existing Node.js TypeScript MCP server using `@modelcontextprotocol/sdk`, Zod, Vitest, Node built-in `fetch`, and Ollama HTTP API endpoints `/api/tags` and `/api/generate`. |
| Runtime configuration | Model configuration must come from `OLLAMA_VISION_MODEL` in the process environment. If absent, the effective model is `llama3.2-vision`. If present but blank after trimming, server tool calls return `INVALID_MODEL_CONFIGURATION` with guidance to unset the variable or provide a non-empty model name. |
| Performance | Resolve the effective model once per readiness or analysis call; do not perform extra Ollama requests beyond the existing `/api/tags` readiness check and `/api/generate` analysis request. |
| Security | Treat model names as data only; never execute configured model values as shell commands; do not log secrets or environment dumps. |
| Accessibility | Not applicable; backend-only MCP server with no user interface. |
| Error handling | Invalid model configuration and unavailable configured models must produce stable structured error codes and actionable text without crashing the MCP server. |
| Documentation | The environment variable, default model, and example invocation must be documented in a project documentation file or server usage document. |

---

## Edge Cases

| Scenario | Input | Expected Behavior |
|----------|-------|-------------------|
| Default model absent | `OLLAMA_VISION_MODEL` is unset | Effective model is `llama3.2-vision`; readiness validates `llama3.2-vision`; analysis sends `model: "llama3.2-vision"`. |
| Configured model happy path | `OLLAMA_VISION_MODEL=llava:latest` and Ollama lists `llava:latest` | Readiness reports ready with `model: "llava:latest"`; analysis sends `model: "llava:latest"`. |
| Configured model with surrounding whitespace | `OLLAMA_VISION_MODEL="  llava:latest  "` | Effective model is trimmed to `llava:latest` for readiness output, model validation, analysis requests, and error details. |
| Empty configured model | `OLLAMA_VISION_MODEL=""` | Server returns `INVALID_MODEL_CONFIGURATION` with guidance; it does not call Ollama for readiness or analysis. |
| Whitespace-only configured model | `OLLAMA_VISION_MODEL="   "` | Server returns `INVALID_MODEL_CONFIGURATION` with guidance; it does not call Ollama for readiness or analysis. |
| Configured model unavailable during readiness | `OLLAMA_VISION_MODEL=llava:latest`, Ollama reachable, `/api/tags` lacks `llava:latest` | Readiness returns not ready with `MODEL_UNAVAILABLE` and details naming `llava:latest`. |
| Configured model unavailable during analysis | `OLLAMA_VISION_MODEL=llava:latest`, image valid, `/api/generate` returns model-not-found response | Analysis returns `MODEL_UNAVAILABLE` and details naming `llava:latest`. |
| Host and model both configured | `OLLAMA_HOST=http://127.0.0.1:11435`, `OLLAMA_VISION_MODEL=llava:latest` | Readiness and analysis use the configured host and configured model independently. |
| Tool discovery after configuration change | Server starts with any model environment | Tool descriptions do not hardcode only `llama3.2-vision`; they describe the effective configured Ollama vision model behavior. |
| Documentation missing or stale | User reads usage documentation | Documentation clearly states `OLLAMA_VISION_MODEL`, default `llama3.2-vision`, and an example command for another local model. |

---

## Acceptance Criteria

- [ ] **AC-1:** Given `OLLAMA_VISION_MODEL` is unset, when the readiness tool validates Ollama models, then it checks for `llama3.2-vision` and reports `llama3.2-vision` as the effective model.
- [ ] **AC-2:** Given `OLLAMA_VISION_MODEL` is unset, when the image analysis tool sends a request to Ollama, then the `/api/generate` body uses `model: "llama3.2-vision"`.
- [ ] **AC-3:** Given `OLLAMA_VISION_MODEL` is set to `llava:latest`, when the readiness tool validates Ollama models, then it checks for `llava:latest` and reports `llava:latest` as the effective model.
- [ ] **AC-4:** Given `OLLAMA_VISION_MODEL` is set to `llava:latest`, when the image analysis tool sends a request to Ollama, then the `/api/generate` body uses `model: "llava:latest"`.
- [ ] **AC-5:** Given `OLLAMA_VISION_MODEL` contains surrounding whitespace, when readiness or analysis resolves the effective model, then the server trims the value before validation, requests, responses, and error details.
- [ ] **AC-6:** Given `OLLAMA_VISION_MODEL` is present but empty or whitespace-only, when readiness or analysis is requested, then the server returns `INVALID_MODEL_CONFIGURATION` without calling Ollama.
- [ ] **AC-7:** Given a configured model is absent from Ollama's local model list, when readiness is requested, then the server returns not ready with `MODEL_UNAVAILABLE` and includes the configured model name in details.
- [ ] **AC-8:** Given a valid image and a configured model that Ollama rejects during generation, when image analysis is requested, then the server returns `MODEL_UNAVAILABLE` or `OLLAMA_REQUEST_FAILED` with the configured model name in details.
- [ ] **AC-9:** Given Claude Code discovers available MCP tools, when it reads the tool descriptions, then the descriptions do not claim that only `llama3.2-vision` can be used and instead reference the configured Ollama vision model.
- [ ] **AC-10:** Given a user wants to switch local vision models, when they read the project usage documentation, then they can find `OLLAMA_VISION_MODEL`, the default `llama3.2-vision`, and an example command that starts the server with a different model.

---

## Dependencies

| Type | Target | Notes |
|------|--------|-------|
| Reads | `process.env.OLLAMA_VISION_MODEL` | New model configuration source. |
| Reads | `process.env.OLLAMA_HOST` | Existing host configuration remains unchanged. |
| Updates | `src/services/ollamaClient.ts` | Replace hardcoded model resolution with effective model configuration for readiness and analysis. |
| Updates | `src/tools/checkReadiness.ts` | Remove duplicate hardcoded model value and report effective model details from the client. |
| Updates | `src/tools/analyzeImage.ts` | Remove duplicate hardcoded model value and preserve structured model errors from the client. |
| Updates | `src/server.ts` | Tool definitions/descriptions must describe configurable model behavior rather than a fixed model. |
| Updates | `src/errors.ts` | Add `INVALID_MODEL_CONFIGURATION` if stable error codes are centralized there. |
| Updates | `tests/ollamaClient.test.ts` | Cover default model, configured model, trimming, invalid model configuration, readiness validation, and analysis request body. |
| Updates | `tests/mcpTools.test.ts` | Cover MCP tool output and descriptions for configurable model behavior. |
| Creates or updates | `README.md` or equivalent usage documentation | Document `OLLAMA_VISION_MODEL`, default value, and example usage. |
| Calls | `${OLLAMA_HOST || "http://localhost:11434"}/api/tags` | Validate the effective configured model exists locally. |
| Calls | `${OLLAMA_HOST || "http://localhost:11434"}/api/generate` | Send the effective configured model name in non-streaming image analysis requests. |

---

## Open Questions

All questions resolved from confirmed feature requirements. The SPEC chooses the allowed fallback path: absent `OLLAMA_VISION_MODEL` falls back to `llama3.2-vision`; present-but-empty configuration fails clearly.

---

## Approval

**Status:** APPROVED

**Approved by:** user
**Date approved:** 2026-05-28
