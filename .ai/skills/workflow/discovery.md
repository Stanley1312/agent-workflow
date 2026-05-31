# Steps 1–2 — Discovery & Feature Selection

## Step 1 — Discovery
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
> **Before finishing:** Synthesize and present back to user:
> 'Here is what I understand: [key facts, stack, constraints]
>  Is this correct? Anything missing?'
> Do not proceed until user confirms.
>
> Report when done."

## Step 2 — Feature Selection
Invoke `architect`:
> "Present the highest-priority unstarted features to the user.
> Confirm selection.
> Report back: feature name + key requirements."

Wait for Architect to confirm selected feature before Step 3.
