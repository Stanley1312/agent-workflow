# Rule: Code Quality

All code written by any agent must follow these standards.

## Structure
- Functions: single responsibility, < 40 lines
- Names: full words, no abbreviations (`user` not `usr`)
- No magic numbers — use named constants
- No hardcoded configs — use environment variables

## Error Handling
- Explicit, typed, logged appropriately
- No silent failures

## Types
- All parameters and return values must be typed

## Hygiene
- No `console.log` in committed code — use logger
- No TODO comments — add to REQUIREMENTS.md instead
- No dead code
- No speculative code — only write what tests require
