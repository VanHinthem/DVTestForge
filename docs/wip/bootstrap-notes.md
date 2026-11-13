# Initial TypeScript Bootstrap

Status: WIP scaffold (2026-11-13).

This bootstrap introduces a single root package (instead of prematurely publishing several packages), strict TypeScript, Playwright Test as the runner, ESLint, Prettier, and a GitHub Actions quality workflow. Tests currently require no browser or Dataverse environment.

## Explicit limitations

- **Not validated against npm registry:** dependency resolution was unavailable from the execution environment. Verify versions and install successfully in GitHub Actions.
- **No lockfile yet:** run `npm install` in a networked environment and commit `package-lock.json`. Change all automated installs to `npm ci` before treating CI as reproducible.
- **Not publishable yet:** `private: true` intentionally prevents accidental publishing; decide package name/scope and feed before a release.
- **No Dataverse controls yet:** the included `test-case-id` module only demonstrates independently testable framework code.
- **No Azure DevOps sync:** the tag utility is not a Test Plans integration.
- **No product pipelines yet:** GitHub Actions validates the framework repository; Azure Pipelines templates will be designed for consuming product repositories.

## Next milestone

Confirm the quality workflow passes, then introduce one verified model-driven UI control and a sample consumer project. Keep the Azure DevOps adapter independent of the Playwright UI core.
