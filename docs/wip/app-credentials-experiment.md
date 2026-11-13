# Experiment: Entra App ID + Client Secret

This is **application-only authentication for the Dataverse Web API**, not a workaround for model-driven app sign-in or Microsoft Entra Conditional Access.

## Requirements

- A registered Entra application (client ID + tenant ID).
- An approved app credential supplied through a secret store or local environment variable.
- A Dataverse **application user** representing that service principal with adequate, least-privilege security roles.
- The organization explicitly permits this server-to-server access pattern.

## Experiment

The helper `acquireDataverseAppToken()` calls the Entra OAuth2 client-credentials endpoint with `scope=https://YOUR-ORG.crm4.dynamics.com/.default`. The helper `probeDataverseAppIdentity()` makes a **read-only** request to `/api/data/v9.2/WhoAmI()`.

Import from the framework package, or use its built output. Do not print tokens, secrets, auth responses or user identifiers in logs. Never commit credentials, and never put them in a chat or PR.

```ts
import { acquireDataverseAppToken, probeDataverseAppIdentity } from 'dvtestforge-framework';

const dataverseUrl = process.env.DATAVERSE_API_URL!;
const credentials = {
  dataverseUrl,
  tenantId: process.env.AZURE_TENANT_ID!,
  clientId: process.env.AZURE_CLIENT_ID!,
  clientSecret: process.env.AZURE_CLIENT_SECRET!,
};

const accessToken = await acquireDataverseAppToken(credentials);
await probeDataverseAppIdentity(dataverseUrl, accessToken);
console.log('Dataverse app-only API authentication succeeded');
```

Do **not** try to inject this token into browser cookies or localStorage; this token represents the app, not an interactive user browser session.

If the probe succeeds, it supports future API-based test setup, cleanup, and assertions. We still need a policy-approved _user/browser_ authentication method for Playwright UI tests.

See Microsoft's [Dataverse authentication documentation](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/authentication) and [Power Platform Playwright authentication guide](https://learn.microsoft.com/en-us/power-platform/developer/playwright-samples/authentication-guide).
