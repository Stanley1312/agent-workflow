# /workflow init

> **Prerequisite:** Run `/setup` to install required tools before running.

1. Load agent `.ai/agents/strategist.md`
2. Load skill `.ai/skills/discuss.md`
3. Load skill `.ai/skills/web_search/SKILL.md` — verify mmx-cli is installed and authenticated

## Discovery Interview

Interview the user about their project until you have a complete, unambiguous picture of what needs to be built.

Ask one question at a time. Wait for the answer before asking the next. Build each question on what the user just told you.

If the project already has code, explore the codebase first — understand the existing structure, stack, and patterns before asking anything.

### What you must understand before finishing

You cannot proceed until you have clear answers to all of these:

- What does this project do, and who uses it?
- Is this greenfield or already in progress?
- What is the full tech stack — be specific (framework, version, language, runtime)
- Does it need a UI? If yes, is there a design system or will one need to be chosen?
- Does it need authentication? If yes, what method and what provider?
- Does it need a database? If yes, what type, and self-hosted or managed?
- Where will it be hosted?
- Are there any third-party integrations?
- Are there any hard constraints (performance, budget, compliance)?

### How to ask

Go as deep as the answer requires. If the user says "Vue", ask which version. If they say "auth", ask which method. If they say "database", ask which one and whether it's self-hosted. Never assume — always clarify.

If an answer makes another question irrelevant, skip it.

If something is vague, push back directly: "That's not specific enough — what exactly do you mean by X?"

### Before proceeding

Synthesize everything you've learned and present it back:
"Here is what I understand about your project:

[key facts, stack, constraints, integrations]
Is this correct? Anything missing or wrong?"


Do not proceed until the user confirms.

---

3. Generate `CLAUDE.md` into **root folder**. Delete placeholder `src/` if it exists.
4. Load skill `.ai/skills/wiki_agent.md` → run Init workflow to create `llm-wiki/`
5. Update `REQUIREMENTS.md` with items surfaced during discovery
6. Update `ROADMAP.md` with initial milestone structure
7. Run `/workflow run` to start first feature.