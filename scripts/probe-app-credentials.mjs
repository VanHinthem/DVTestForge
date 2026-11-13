/**
 * Read-only application-only authentication probe.
 * This does not sign into a model-driven app UI.
 */
import process from 'node:process';
import { acquireDataverseAppToken, probeDataverseAppIdentity } from '../dist/index.js';

async function main() {
  const dataverseUrl = process.env.DATAVERSE_API_URL;
  const tenantId = process.env.AZURE_TENANT_ID;
  const clientId = process.env.AZURE_CLIENT_ID;
  const clientSecret = process.env.AZURE_CLIENT_SECRET;

  if (!dataverseUrl || !tenantId || !clientId || !clientSecret) {
    throw new Error(
      'Set DATAVERSE_API_URL, AZURE_TENANT_ID, AZURE_CLIENT_ID, and AZURE_CLIENT_SECRET',
    );
  }

  const accessToken = await acquireDataverseAppToken({
    dataverseUrl,
    tenantId,
    clientId,
    clientSecret,
  });
  await probeDataverseAppIdentity(dataverseUrl, accessToken);
  process.stdout.write('App-only Dataverse Web API authentication succeeded.\n');
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : 'Authentication failed'}\n`);
  process.exitCode = 1;
});
