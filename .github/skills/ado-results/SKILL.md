---
name: ado-results
description: Integrate Playwright Test execution and JUnit reporting with Azure Pipelines and verify accurate result association with Azure DevOps Test Plans.
---
# Azure DevOps reporting playbook

1. Define stable mapping across test ID, Test Case work item, test plan/suite, test point, configuration and Azure Pipeline run.
2. Configure the Playwright JUnit reporter and publish results via `PublishTestResults@2`; retain traces/screenshots with an approved policy.
3. **Do not confuse Pipeline JUnit results with updated Test Plans test points.** Verify native Playwright association in the target Azure DevOps organization.
4. If native association is insufficient, design an optional REST adapter that creates/updates runs/results using documented APIs and approved least-privilege credentials.
5. Make reruns, retries and publishing idempotent. Do not mark a test passed from partial or stale results.
6. Exercise at least one passing and one failing test and confirm the intended Test Plans test point/configuration reflects the correct outcome.
7. Isolate adapter errors from UI library logic; report partial publication failures explicitly.
8. Document permissions, API assumptions, validation evidence and known gaps.
