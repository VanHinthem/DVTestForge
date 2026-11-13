# DVTestForge

A central **Playwright Test + TypeScript** automation framework for Microsoft Dataverse model-driven applications.

> Early-stage scaffold: no Dataverse controls, Azure Test Plans integration, or published npm package yet.

## Architecture

- This repository owns the generic UI automation framework and optional integrations.
- Product repositories own their own automated tests and depend on versioned framework releases.
- Existing Gherkin scenarios may be imported into Azure DevOps Test Plans; direct Gherkin execution is not required.
- The framework has no runtime dependency on EasyRepro, SpecFlow, Selenium, or Microsoft's Power Platform Playwright samples.

See [architecture and scope](docs/wip/architecture-and-scope.md) and [contribution instructions](AGENTS.md).

## Local development

Requirements: Node.js 22+ and npm.

```bash
npm install
npm run check
```

The current tests are **browser-free Playwright Test unit tests**. They validate only the initial Test Case ID tag utility. A real Dataverse tenant is **not** required.

For a fully reproducible installation, generate and commit `package-lock.json`, then switch local and CI installs to `npm ci`. The initial scaffold intentionally does not claim a lockfile or package publication.

## Current layout

```text
src/                 Framework TypeScript source
tests/               Framework tests
.github/workflows/   GitHub quality validation
docs/wip/            Architecture notes and proposals
```

## Roadmap

1. Verify dependency installation, lint, typechecking and tests in CI.
2. Introduce verified Dataverse controls using Playwright primitives.
3. Separate optional Azure DevOps Test Plans integration.
4. Publish versioned npm artifacts and consume them from an independent product repository.
5. Build shared Azure Pipelines templates for product execution and result publication.

See the [PoC acceptance criteria](docs/wip/architecture-and-scope.md#initial-proof-of-concept--acceptance-criteria).
