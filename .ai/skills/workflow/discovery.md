# Steps 1–2 — Discovery & SPEC

## Step 1 — Discovery + SPEC
Invoke `strategist`:
> "Run the discovery interview for the next feature.
> Only skip if the user explicitly says 'skip interview' or 'no questions'.
>
> **How to interview:**
> - If the project already has code, explore the codebase first —
>   understand the existing structure, stack, and patterns before asking anything.
> - Ask one question at a time. Wait for each answer before continuing.
>   Build each question on what the user just told you.
> - Go as deep as the answer requires. If the user says 'Vue', ask which version.
>   If something is vague, push back: 'That's not specific enough — what do you mean by X?'
> - If a question can be answered by reading existing code or context, do that instead of asking.
> - Walk down every branch of the design tree, resolving dependencies one-by-one.
>   Continue until every open question is resolved.
>
> **Must understand before finishing:**
> - What does this feature do, and who uses it?
> - What is the full tech stack — specific versions, not just names
> - Does it need a UI? If yes, is there a design system?
> - Does it need auth? If yes, what method and provider?
> - Does it need a database? If yes, what type, self-hosted or managed?
> - Any third-party integrations?
> - Any hard constraints (performance, budget, compliance)?
>
> **Before writing SPEC:** Synthesize and confirm with user:
> 'Here is what I understand: [key facts, stack, constraints]. Is this correct?'
> Do not proceed until user confirms.
>
> Then write SPEC and get user approval.
> Report: 'SPEC approved' when done."

Wait for Strategist to report SPEC approved before Step 2.

## Step 2 — PLAN
Invoke `architect`:
> "Read the approved SPEC at .ai/active/current/SPEC.md.
> Run Pre-PLAN Ritual then write PLAN.md.
> Report when done."

Wait for Architect to confirm PLAN written.

## Step 3 — Dependency Preflight
Invoke `devops`:
> "Run dependency preflight.
> Read .ai/active/current/PLAN.md to understand the stack.
> Report: 'Environment OK' or what needs user action."

Wait for DevOps to confirm environment OK before starting wave loop.
