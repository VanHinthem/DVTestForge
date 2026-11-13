# DVTestForge — Agent Instructions

These instructions apply to all work in this repository. Read [the WIP architecture](docs/wip/architecture-and-scope.md) before making architectural changes.

## Mission and boundaries
- Build **DVTestForge**, a centrally maintained Playwright Test + TypeScript framework for Microsoft Dataverse model-driven apps, consumed by independent product repositories.
- Start from scratch. Do **not** depend on SpecFlow, EasyRepro, Selenium, or Microsoft Power Platform Playwright sample runtime libraries.
- Microsoft samples and other projects are references, not dependencies. Check license and provenance before copying code.
- Keep the browser/Dataverse core independent of Azure DevOps. Test Plans integration is an optional adapter.
- Product-specific tests, business scenarios and environment settings belong in consumer repos, not the core framework.
- WIP documents are proposals. Do not present an unimplemented integration as supported.

## Implementation conventions
- TypeScript with strict type checking and Playwright Test APIs. Prefer typed, narrow public interfaces and explicit exports.
- Use Playwright `Locator`, role/label selectors where stable, `expect` assertions, and auto-waiting. Never use arbitrary `waitForTimeout` to mask synchronization problems.
- Do not invent Dynamics selectors; verify against real DOM/accessible tree and test controls in representative model-driven apps.
- Support asynchronous state without racing. Avoid shared mutable page/context objects across tests.
- Build composable controls (forms, fields, lookups, grids, tabs, commands, BPF), not an unbounded set of Gherkin-style magic strings.
- Put every new public control behind tests and documentation, including errors and unsupported cases.
- Keep code comments and documentation in English.

## Safety and credentials
- Never commit secrets, storage-state/authentication files, access tokens, customer data, or tenant-specific URLs.
- Use approved test identities and least-privilege credentials. Avoid bypassing MFA or tenant policy.
- Default to isolated synthetic test records; clean up only records created by the active test run.
- Treat screenshots, traces and logs as potentially sensitive; redact and limit retention.

## Test Plans and delivery
- Preserve stable Azure DevOps Test Case IDs in automation metadata; report mapping by test case, test point and configuration, not just title.
- JUnit reports in Pipelines do not automatically establish Test Plans result linkage. Validate this integration.
- Publish central npm packages with versioned releases; consumer repos pin versions and lockfiles.
- Framework changes require tests, documentation, and impact/compatibility analysis. Never force unreviewed upgrades to consumers.

## Working approach
1. Inspect existing code and relevant docs before editing; prefer minimal scoped changes.
2. State assumptions and any uncertain Dataverse/ADO behavior.
3. Implement and run the most focused available checks; if environment is not provisioned, describe what was not run.
4. Do not claim success for integrations or browser tests without execution evidence.
5. Update docs and examples alongside public API changes.
