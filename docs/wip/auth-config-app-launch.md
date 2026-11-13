# Authentication, Configuration and App Launch — Initial Foundation

Status: browser-free implementation; **not yet validated against a real Dataverse tenant**.

## Configuration

Set `DATAVERSE_APP_URL` to the direct model-driven app URL copied from Power Apps. `loadDataverseConfig()` validates HTTPS, the `/main.aspx` endpoint, and the presence of `appid` or `appname`. It does not independently verify the tenant, environment, security role or application identity. Consumers must use an approved URL and test account.

The library reads `process.env` or an explicitly supplied environment map. It deliberately does not load `.env` files automatically. A product may load environment variables via its own runtime/CI configuration.

## Authentication

Authentication is delegated to an approved Entra ID sign-in mechanism. This first increment **does not implement automated sign-in**, certificate-based authentication, refresh-token management, or MFA automation.

Playwright can restore browser state with `test.use({ storageState: resolveAuthStatePath() })`. Capture it using `captureAuthenticatedState(page, verifyAuthenticated)` **only after the caller's verification succeeds**.

For a local interactive bootstrap, a product test harness can launch a headed browser, navigate to the approved app URL, let the user sign in using the organization's approved flow, wait for app-specific readiness, then save state. This needs a product-owned script/setup test; the framework deliberately does not guess sign-in form selectors.

Auth state may contain bearer credentials or impersonation-capable cookies:

- `playwright/.auth/` is ignored by Git; do not commit auth JSON, traces, screenshots or CI artifacts containing secrets.
- Restrict file access and use short retention. Delete and regenerate expired state.
- Do not persist user credentials, MFA codes, tokens or session data in repository settings.
- For CI, obtain an **organization-approved unattended authentication method** and use isolated state per identity/worker. A local cached state file is not a secure CI credential distribution strategy.
- Playwright `storageState` does not necessarily capture all applications' session storage; verify real login lifecycle for the target app.

## Application launch

`new DataverseApp(page).open(config, verifyReady)` opens the direct app URL and waits for a **consumer-supplied readiness assertion**. The assertion must distinguish a fully ready application from an Entra sign-in redirect or loading shell.

Example shape (illustrative only):

```ts
import { test, expect } from '@playwright/test';
import { DataverseApp, loadDataverseConfig, resolveAuthStatePath } from 'dvtestforge-framework';

test.use({ storageState: resolveAuthStatePath() });

test('open approved application', async ({ page }) => {
  const app = new DataverseApp(page);
  await app.open(loadDataverseConfig(), async () => {
    await expect(page.getByRole('navigation')).toBeVisible();
  });
});
```

The navigation assertion is not yet validated for a particular model-driven app. Verify accessibility roles and selectors in the pilot environment before relying on them.

## Follow-up work

1. Choose/test the actual approved Entra authentication flow for local and CI executions, including MFA and Conditional Access.
2. Create a product-owned interactive setup and a secure CI state provisioner.
3. Validate app readiness with a live model-driven app and a role-scoped test identity.
4. Add area/subarea navigation after observing the application's sitemap.
5. Add fixtures with state isolation per account and parallel worker.
6. Exercise auth expiry, consent screens and unauthorized-app scenarios.
