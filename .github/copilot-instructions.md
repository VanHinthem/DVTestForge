# GitHub Copilot — DVTestForge

Follow the repository's [AGENTS.md](../AGENTS.md) and [working architecture](../docs/wip/architecture-and-scope.md). Repository language is **English**.

DVTestForge is a **central TypeScript + Playwright Test framework**, **not** a repository containing all product tests. Consumers use versioned npm packages and own product-specific test code. Do not introduce SpecFlow, EasyRepro, Selenium, Microsoft Power Platform sample libraries, or an unapproved Dataverse UI wrapper.

Rules:
- Implement small, typed, composable control abstractions using Playwright locators and assertions; verify Dataverse DOM selectors before assuming they work.
- Favor stable semantic locators and bounded observable waits; do not use fixed sleeps as a synchronization strategy.
- No secrets, real user data, storage-state files, credentials or environment endpoints in source control.
- Isolate Azure DevOps Test Plans and pipeline integrations from the UI automation core.
- Distinguish exploratory design from tested functionality; do not invent integrations, package names or commands.
- Add targeted unit/integration tests and English documentation for public features.
- For migrations, retain traceability to Gherkin sources and preserve functional assertions; after migration Test Plans is the proposed source of truth.
- Test Case IDs must map deterministically to pipeline results and Test Plan test points/configurations; JUnit publication alone is insufficient.

Relevant skills: `.github/skills/`. Role agents: `.github/agents/`. Path-specific rules: `.github/instructions/`.
