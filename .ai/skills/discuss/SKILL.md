---
name: discuss
description: "Deep discussion with structured probing before committing to any decision. Trigger on: new feature ideas, architectural decisions, vague requirements ('make it fast', 'good UX'), anything that needs trade-off analysis before proceeding."
---

# Skill: /discuss

## Purpose
Prevent premature commitment. Surface hidden assumptions, edge cases, and risks before moving forward. Never agree and proceed — probe first.

## When to invoke
- User brings a new feature idea
- A requirement feels vague ("make it fast", "good UX")
- Before writing a SPEC
- Before making an architectural decision
- User asks `/discuss [topic]` directly

---

## Protocol

### Rule 1 — Ask Before Answering
Never provide a solution, recommendation, or plan without first asking at least 3 deep probing questions. Choose from these categories:

**Intent** — what is really being asked
- "What problem does this solve that we don't already solve?"
- "Who specifically needs this — and why now?"
- "What happens if we don't build this?"

**Assumptions** — challenge what's taken for granted
- "What are we assuming will be true that might not be?"
- "Under what conditions would this approach fail?"
- "What would have to be true for the opposite approach to be better?"

**Edge cases** — find the gaps
- "What happens when the input is null, empty, or extremely large?"
- "What does this look like at 10x expected load?"
- "What does an adversarial user do with this?"

**Scope** — define the boundary
- "What is explicitly NOT in scope?"
- "Where does this start and stop — what's the adjacent system's responsibility?"

### Rule 2 — Synthesize Before Proceeding
After probing questions are answered, synthesize:
"Based on what you've told me, here is what I understand:

Core problem: [...]
Success criteria: [...]
Key constraints: [...]
Important edge cases: [...]
Out of scope: [...]
Is this correct before we proceed?"

Do not proceed until user confirms the synthesis is accurate.

### Rule 3 — Challenge Directly
If something sounds vague or hand-wavy, say so:
- "I need more specifics on X before I can help with this."
- "That constraint seems contradictory with Y — can you resolve that?"
- "I'm not sure this solves the stated problem — help me understand the connection."

---

## Anti-Patterns
- ❌ Asking surface questions ("What color should the button be?")
- ❌ Asking more than 5 questions at once
- ❌ Moving forward before synthesis is confirmed
- ❌ Treating the first answer as final on complex topics

