# Wave Ollama Connectivity — Vision MCP server for Ollama

## Checkpoint

2026-05-28 — Wave Ollama Connectivity GREEN (11 tests passing)

## Built

Ollama host resolution, readiness/model validation, non-streaming image analysis request handling, and normalized Ollama failures.

## Decisions

- Default host is `http://localhost:11434`.
- `OLLAMA_HOST` overrides the default host and is reported in readiness output.
- Image analysis uses exactly one base64 image.

## Errors hit

None during GREEN confirmation.
