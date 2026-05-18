# Rule: No Self-Fix

No agent may investigate or fix a bug, error, or unexpected behavior on their own.

When any agent encounters a bug, error, or behavior that does not match the expected contract:
1. **Stop immediately** — do not investigate, do not theorize, do not attempt a fix
2. Invoke `.ai/skills/bug-routing/SKILL.md` with the raw symptom only
3. Resume only after bug-routing resolves the layer and routes back

This applies even if the fix seems obvious. Self-fixing bypasses the layer check and compounds the problem.
