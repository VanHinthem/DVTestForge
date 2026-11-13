# Local Authentication Setup and Reusable Fixtures

Status: development foundation; **not yet validated against live Dataverse/Entra ID**.

## Local interactive authentication

From the framework checkout:

1. Run `npm ci` and `npm run build`.
2. Install the browser: `npx playwright install chromium`.
3. Set `DATAVERSE_APP_URL` to the approved direct model-driven app URL.
4. Set `DATAVERSE_READY_SELECTOR` to a **verified CSS selector** for an element that exists only once the intended app has loaded. Observe your own pilot app: do not assume a universal selector.
5. Run `node scripts/auth-setup.mjs` in a local interactive terminal (not CI).
6. Complete your organization's Entra login, including any required MFA, **manually** in the opened browser.
7. Once the app is fully loaded, press Enter in the terminal. The script checks your app-specific readiness selector and the expected origin **before** saving state to `playwright/.auth/user.json`.

Example PowerShell environment setup:

```powershell
$env:DATAVERSE_APP_URL = 'https://YOUR-ENVIRONMENT.crm.dynamics.com/main.aspx?appid=YOUR-APP-ID'
$env:DATAVERSE_READY_SELECTOR = 'YOUR-VERIFIED-CSS-SELECTOR'
npm run build
node scripts/auth-setup.mjs
```

The script does **not** automate the Entra login form, handle MFA on behalf of users, or bypass Conditional Access.

A rendered app element and matching origin do not independently prove the user's identity or security role. Verify the pilot flow with a real app and approved account before depending on the state for production-like tests.

## Consuming Playwright fixtures

A product repository can define its own suite:

```ts
// tests/fixtures.ts (in the consuming product repo)
import { createDataverseTest, expect } from 'dvtestforge-framework';

export const test = createDataverseTest();
export { expect };
```

```ts
// tests/app.spec.ts (illustrative only; customize the readiness assertion)
import { test, expect } from './fixtures.js';

test('opens an approved model-driven app', async ({
  page,
  dataverseApp,
  dataverseConfig,
}) => {
  await dataverseApp.open(dataverseConfig, async () => {
    await expect(page.locator('YOUR-VERIFIED-CSS-SELECTOR')).toBeVisible();
  });
});
```

The Playwright context starts with `playwright/.auth/user.json`. Without the file (or with expired state), Playwright will fail and the user must authenticate again. The framework does not silently recover or retry interactive authentication.

Use one isolated identity and state file per parallel worker if tests mutate shared records or user state; define an approved CI identity strategy separately.

## Security and CI boundaries

- Authentication state is sensitive; Git ignores `playwright/.auth/`. Do not copy it to Git, build artifacts, Teams, or pipeline variables.
- Set appropriate file permissions and retention on your machine; delete the state when done.
- GitHub Actions in this repository runs only browser-free unit tests; it must **not** call the interactive script or require Dataverse credentials.
- Azure Pipelines unattended authentication requires a separately reviewed Entra-compatible method; **do not reuse or upload developer browser-state files**.
- `createDataverseTest` is a test-instance factory, not a token provider or identity authenticator.
