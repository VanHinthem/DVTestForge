---
name: playwright-test-authoring
description: Create or review product-side TypeScript Playwright tests from Azure DevOps Test Case steps, using stable DVTestForge APIs and auditable test IDs.
---

# Playwright test authoring

Use when producing TypeScript automation for a functional test case.

1. Read Action/Expected Result steps, preconditions and test data; identify ambiguities before coding.
2. Map each expected outcome to a real assertion; do not replace persistence checks with a mere nonempty input value.
3. Use a stable Test Case ID in test metadata (e.g. tag `@TC12345`) and retain the source context for traceability.
4. Use DVTestForge framework APIs and product-owned workflows; avoid duplicating low-level selector logic in product tests.
5. Keep browser setup, login and synthetic data in fixtures; run safely in parallel with cleanup of test-owned records.
6. Use API setup/verification where appropriate, but exercise the UI path that the functional requirement targets.
7. Produce reviewable, deterministic tests; AI-generated code is a draft and requires human PR review.
8. Run the test or identify explicitly what environment/access is missing; include trace/screenshot evidence on failures.

Do not edit Azure DevOps Test Case definitions implicitly while writing automation.
