# Workflow Project Conventions

## Branch strategy
- `main` = pure workflow framework — all workflow changes go here
- `test/*` = project branches — rebase onto main after workflow changes
- Never edit workflow files on test branches

## File editing rules
- Never edit files without showing diff/plan first and getting approval
- Never commit without asking user first
- Never push without user seeing the diff and approving

## .ai/ vs .claude/ separation
- `.ai/` = canonical SOT (source of truth) — edited by humans/agents
- `.claude/` = output for Claude Code to read — future CLI will sync from .ai/
- Never sync manually unless explicitly asked

## Skill invocation paths
- When telling an agent to invoke/run/load a skill → use skill name only, NO `.ai/` path
- BAD: `invoke .ai/skills/bug-routing/SKILL.md`
- GOOD: `invoke bug-routing skill`
- Reason: `.ai/` is the SOT folder. Each coding environment (Claude Code, Cursor, etc.) has its own folder. A tool will parse/sync from `.ai/` to the appropriate folder. Hardcoding `.ai/` breaks portability.

## .claude/rules/ vs .ai/rules/
- `.claude/rules/` = auto-loaded by Claude Code main session
- `.ai/rules/` = canonical rules — agents read via Standard Preamble in workflow SKILL.md
- Cross-cutting rules (no-self-fix, agent-boundaries, code-quality, testing-conventions) live in both

