# DVTestForge — Working Notes

> Status: Work in progress (WIP)  
> Language: English  
> Last updated: 2026-11-13  
> Scope: proposed architecture and decisions from the initial discovery discussion. Not yet an implementation specification.

## Vision

DVTestForge is a centrally maintained, extensible **Playwright Test + TypeScript** automation framework for Microsoft Dataverse / Dynamics 365 model-driven applications. Independent product repositories consume the framework and own their own automated tests. Functional consultants manage scenarios in **Azure DevOps Test Plans**; **Azure Pipelines** runs the tests and publishes results in Pipelines and, where supported, Test Plans.

The framework starts **from scratch**: there is no runtime or backwards-compatibility dependency on SpecFlow, EasyRepro, Selenium, or Microsoft's Power Platform Playwright sample toolkit.

## Working decisions

| Topic                                      | Direction                                                                                               | Status                            |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------- | --------------------------------- |
| Name                                       | DVTestForge                                                                                             | Agreed                            |
| Documentation language                     | English                                                                                                 | Agreed                            |
| Test automation                            | Playwright Test + TypeScript                                                                            | Preferred direction               |
| UI abstraction                             | Own Dataverse-specific implementation, built on Playwright primitives                                   | Agreed                            |
| Existing SpecFlow/EasyRepro                | No legacy compatibility layer                                                                           | Agreed                            |
| Existing Gherkin                           | Preserve as source material for migration to Azure DevOps Test Cases                                    | Preferred direction               |
| Functional source of truth after migration | Azure DevOps Test Plans, not duplicate maintained Gherkin files                                         | Proposed                          |
| Test code ownership                        | Product repositories                                                                                    | Agreed                            |
| Shared framework ownership                 | Dedicated central GitHub repository, versioned npm packages                                             | Agreed                            |
| Distribution                               | Internal npm registry / Azure Artifacts (actual organization scope TBD)                                 | Proposed                          |
| Execution                                  | Product Azure Pipelines using reusable templates                                                        | Agreed direction                  |
| Results                                    | Publish to pipeline; associate with the correct Test Plans test case, run, test point and configuration | Required; integration to validate |
| AI                                         | Optional assistance for drafting code from test cases, with PR review                                   | Proposed                          |

## Separation of responsibilities

- **Central framework repository:** Playwright fixtures, Dataverse UI controls (forms, tabs, lookups, grids, commands, BPFs), configuration, logging, retry-safe waiting patterns, assertions, test data utilities, optional Dataverse API client abstractions, Azure DevOps adapter, shared pipeline templates and documentation.
- **Product repository:** Product-specific `.spec.ts` tests, page/workflow abstractions, fixtures, environment mapping, test data definitions, and product-specific component extensions. Pins a tested version of the central npm package.
- **Azure DevOps Test Plans:** Functionally maintained test cases, expected results, test suites, manual/automation coverage and traceability.
- **Azure Pipelines:** Install dependencies; run Playwright against approved test environments; publish JUnit results and diagnostics; optionally update Test Plans with associated runs/results.
- **AI tooling (optional):** Generate a draft test implementation from test-case steps and observed UI, never silently overwrite reviewed test code.

## Target process

1. **One-time migration:** Parse existing `.feature` files and create or update test cases in Azure DevOps. Retain original Gherkin as migration evidence (not a second live source of truth).
2. **Consultant authoring:** Functional consultants maintain actions and expected results in Test Plans.
3. **Automation authoring:** Developer or AI-assisted tool maps a Test Case ID to a product-owned TypeScript Playwright test. PR review validates semantics and locators.
4. **Execution:** Product pipeline uses pinned DVTestForge package and shared pipeline template to execute tests.
5. **Reporting:** Pipeline displays JUnit-style test results and artifacts; Test Plans receives outcome at the correct test run/test point/configuration where integration permits.
6. **Change management:** Changes to test-case steps should flag associated automation for review; do not silently regenerate production test code.

## Architecture (conceptual)

```text
Existing Gherkin (*.feature) [migration only]
              |
              v
  Gherkin-to-Test-Case importer
              |
              v
   Azure DevOps Test Plans
   (functional source of truth)
              |
     author / assist / review
              v
     Product repository A/B/C
     tests/*.spec.ts, pages/
              |
     versioned npm dependency
              v
      DVTestForge (GitHub)
      core | model-driven UI
      Dataverse API | testplans adapter
              |
              v
        Playwright Test
              |
              v
       Azure Pipelines
        /           \
       v             v
 Pipeline results  Test Plans results
 traces/screenshots (validated mapping)
```

### Initial repository layout (proposal)

```text
DVTestForge/
  docs/
    wip/
  packages/
    core/
    model-driven/
    dataverse-api/
    azure-devops/
  templates/
    azure-pipelines/
  examples/
    sample-product/
```

Packages are **logical boundaries**, not necessarily separate published npm packages initially. Begin with a small package surface and split only if justified. The core UI layer must be runnable locally without Azure DevOps services.

### Example consumer

```text
ProductRepository/
  tests/ui/
    tests/
    pages/
    fixtures/
    playwright.config.ts
    package.json
    package-lock.json
```

Consumer repositories pin specific DVTestForge releases and use reproducible lockfiles. A central framework release must **not** automatically break product tests; product teams upgrade intentionally, ideally with automated dependency-update pull requests and compatibility checks.

## Dataverse-specific engineering principles

- Prefer resilient accessible locators and narrowly scoped, tested selectors; Dynamics attributes are not guaranteed stable across all controls or platform releases.
- Explicit support for text, number, date, choice, lookup, rich text, tabs, subgrids, command bar, notifications, and business process flows.
- Handle asynchronous application behavior with observable state and Playwright auto-waiting/assertions; avoid arbitrary sleep calls.
- Use the Dataverse API for setup, cleanup and selective verification when that is more reliable than UI operations; use UI actions when user behavior is what is being tested.
- Isolate records, users, browser contexts, and test runs to enable safe retries and parallel execution.
- Authenticate with approved Entra ID test identities and policies. Treat browser storage state, tokens and environment credentials as secrets; never commit them to Git.
- Provide useful diagnostics: Playwright traces, screenshots on failure, console/network context where safe, and stable Test Case identifiers.
- Keep the Azure DevOps integration isolated from form/grid/locator logic.
- Take inspiration from Microsoft Power Platform Playwright samples and other repositories, but **do not depend on their runtime libraries**. Verify licenses before copying code.

## Test Case migration considerations

- `Feature` maps to suite/grouping; `Scenario` to a Test Case; `Given` to preconditions/setup where appropriate; `When` to actions; `Then` to expected results.
- Support `Background`, `Scenario Outline`, `Examples`, tags and data tables without losing functional intent.
- Decide whether outlines produce parameterized cases or expanded test cases based on Azure DevOps capabilities and reporting needs.
- Keep original source references and a deterministic migration key for idempotent imports, auditability, and duplicate avoidance.
- Do not assume every Gherkin sentence is a good manual Test Plans action: group actions and expected results by business intent and review converted cases with functional consultants.

## Test ID and reporting strategy

Use a stable mapping, e.g. `@TC12345` or structured metadata in each Playwright test. Do not rely solely on test title matching. JUnit publication through `PublishTestResults@2` makes results visible in Azure Pipelines, **but does not on its own prove that specific Test Plan test points are updated**.

Before designing the adapter, validate current native Azure DevOps support for Playwright/JavaScript automated-test association. If insufficient, assess REST-based management of test runs, results, points/configurations and attachments, with explicit permissions and idempotency.

## Open questions / risks

1. Does the Azure DevOps organization support the required native Playwright-to-Test-Plans association, or is a custom results adapter required?
2. Which Azure DevOps project(s), Test Plans hierarchy and permission model will own test cases and test runs?
3. Are test plans already used for manual testing, or do we need to introduce the workflow?
4. How should Scenario Outlines, shared preconditions and data tables be represented in Test Plans?
5. Which Entra ID authentication strategy is permitted for unattended test agents?
6. Which Dataverse UI controls, PCF components and custom pages are required by the first product?
7. How will framework packages and pipeline templates be versioned, signed, distributed and consumed across repos?
8. What is the approved Azure Artifacts feed and npm scope? (Do not assume `@dataverse` is available.)
9. What are the required browser matrix, execution frequency, parallelism limits and test data isolation requirements?
10. How do we detect a functional test-case update that invalidates an existing automated test?

## Initial proof of concept / acceptance criteria

**P0 — Gherkin import**

- Import one representative existing feature (including at least one expected result) into Test Plans.
- Preserve mapping to source feature/scenario, handle re-import without duplicates, confirm meaning with a functional consultant.

**P1 — Own Playwright-based model-driven UI**

- Implement one end-to-end scenario in TypeScript: create a Dataverse record with a lookup, save and assert persisted state.
- No EasyRepro, Selenium or third-party Dataverse automation wrapper dependency.
- Run locally with secure test authentication.

**P2 — Central package and product consumer**

- Publish an initial versioned package from central repository and consume it from a separate sample/product repo.
- Demonstrate safe independent upgrade from one package version to another.

**P3 — Azure Pipeline**

- Execute tests on an agent; publish JUnit reports, screenshots and traces with relevant retention/privacy controls.

**P4 — Azure Test Plans**

- Demonstrate one-to-one mapping from Playwright test to intended Azure DevOps Test Case **and** correct test point/configuration.
- Show a passed result and a failing result in both Pipeline reporting and Test Plans, or document any missing native capability and a verified alternative.

**P5 — AI-assisted test authoring (optional)**

- Generate a draft TypeScript test from a Test Case, review in PR, demonstrate how changed test-case steps trigger review.

## Non-goals for the first iteration

- Recreating every EasyRepro or Crm.Specflow step/feature.
- Executing Gherkin directly as a mandatory runtime dependency.
- Building a full-fledged test management product.
- Fully automated or unreviewed AI-generated tests.
- Binding all products to an always-latest, centrally forced framework version.

## Next step

Select one real Gherkin feature and one pilot product repository, then implement P0–P4 end-to-end before expanding the control library.

## References

- Previous framework inspiration (not a dependency): https://github.com/mVermaat/Crm.Specflow
- Microsoft samples (reference only): https://github.com/microsoft/power-platform-playwright-samples
- Playwright documentation: https://playwright.dev/
- Azure DevOps Test Plans documentation: https://learn.microsoft.com/en-us/azure/devops/test/
- Azure Pipelines test results: https://learn.microsoft.com/en-us/azure/devops/pipelines/test/
