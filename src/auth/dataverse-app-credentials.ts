/**
 * Application-only authentication for the Dataverse Web API.
 *
 * IMPORTANT: An app-only token does not authenticate a human user in the
 * model-driven browser UI or create a Playwright storageState session.
 * Requires an Entra app registration and a Dataverse application user with
 * the appropriate Dataverse security role.
 */
export interface DataverseAppCredentials {
  readonly tenantId: string;
  readonly clientId: string;
  readonly clientSecret: string;
  readonly dataverseUrl: string;
}

function requireValue(value: string, name: string): string {
  if (!value.trim()) {
    throw new Error(`${name} is required`);
  }
  return value.trim();
}

function validateDataverseOrigin(value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error('dataverseUrl must be an absolute HTTPS origin');
  }
  if (
    url.protocol !== 'https:' ||
    !url.hostname ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  ) {
    throw new Error('dataverseUrl must be an HTTPS origin without path or query');
  }
  return url.origin;
}

/** Requests an Entra client-credentials access token for the Dataverse API. */
export async function acquireDataverseAppToken(
  credentials: DataverseAppCredentials,
  request: typeof fetch = fetch,
): Promise<string> {
  const tenantId = requireValue(credentials.tenantId, 'tenantId');
  const clientId = requireValue(credentials.clientId, 'clientId');
  const clientSecret = requireValue(credentials.clientSecret, 'clientSecret');
  const origin = validateDataverseOrigin(credentials.dataverseUrl);

  // A single tenant GUID prevents a caller-controlled OAuth endpoint path.
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(tenantId)) {
    throw new Error('tenantId must be a GUID');
  }

  const response = await request(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        scope: `${origin}/.default`,
      }),
    },
  );
  if (!response.ok) {
    // Never include raw error bodies: identity providers can echo sensitive data.
    throw new Error(`Entra app-token request failed (HTTP ${response.status})`);
  }
  const payload: unknown = await response.json();
  if (
    typeof payload !== 'object' ||
    payload === null ||
    !('access_token' in payload) ||
    typeof payload.access_token !== 'string' ||
    !payload.access_token
  ) {
    throw new Error('Entra app-token response did not include an access token');
  }
  return payload.access_token;
}

/**
 * Read-only API probe. Resolves the effective Dataverse application identity.
 * Does not modify records or prove interactive UI login.
 */
export async function probeDataverseAppIdentity(
  dataverseUrl: string,
  accessToken: string,
  request: typeof fetch = fetch,
): Promise<void> {
  const origin = validateDataverseOrigin(dataverseUrl);
  const token = requireValue(accessToken, 'accessToken');
  const response = await request(`${origin}/api/data/v9.2/WhoAmI()`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'OData-Version': '4.0',
      'OData-MaxVersion': '4.0',
    },
  });
  if (!response.ok) {
    throw new Error(`Dataverse WhoAmI probe failed (HTTP ${response.status})`);
  }
}
