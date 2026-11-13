---
applyTo: "**/*.ts,**/*.tsx"
---
# TypeScript and Playwright conventions

- Prefer strict TypeScript; avoid `any`, untyped public parameters and implicit dynamic property access.
- Use `@playwright/test` as the test runner. Public framework APIs should accept `Page`/`Locator` or narrowly defined contracts, not hidden globals.
- Use locator-based actions, resilient assertions and observable wait conditions. Avoid `page.waitForTimeout()` except an explicitly documented diagnostic-only case.
- Keep fixtures test-scoped and parallel-safe; do not share browser contexts or seeded records between independent tests.
- Prefer composable control objects over giant page objects or overly generic string-driven steps.
- Mock external services for isolated tests; use real Dataverse UI integration tests only in designated test environments.
- Avoid logging tokens, personally identifiable data, traces of sign-in flows or raw authorization headers.
