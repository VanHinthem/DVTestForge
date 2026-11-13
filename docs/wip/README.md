# Work in progress

This directory contains **working design notes** for DVTestForge. They are discussion artifacts, not implemented features or approved production standards.

## Documents

- [Architecture and Scope](architecture-and-scope.md) — vision, decisions, architecture, risks, and PoC acceptance criteria.
- [AI Agent Customization](agent-customization.md) — instructions, specialized agents, skills, governance and validation checklist.

## Current direction

DVTestForge is an independently maintained Playwright Test + TypeScript framework for Microsoft Dataverse model-driven applications. Product repositories own tests and depend on a versioned central npm package. Functional consultants maintain test cases in Azure DevOps Test Plans, informed initially by migrated Gherkin features. Azure Pipelines executes tests and publishes results; the exact Test Plans association mechanism remains to be validated.

The framework will **not depend on legacy SpecFlow/EasyRepro/Selenium or third-party Dataverse-specific UI automation wrappers**. Existing samples may serve as licensed references or inspiration.

## Document lifecycle

Working proposals live here until reviewed. Once decisions and implementation contracts are agreed, promote their content to stable documentation under `docs/`; avoid treating WIP assumptions as established behavior.

Last updated: 2026-11-13.
