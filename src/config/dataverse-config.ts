/** Runtime settings owned by the consuming product repository. */
export interface DataverseConfig {
  readonly appUrl: string;
}

/**
 * Load a direct model-driven app URL from an environment mapping.
 * No credentials or secrets are accepted by this configuration layer.
 */
export function loadDataverseConfig(environment: NodeJS.ProcessEnv = process.env): DataverseConfig {
  const appUrl = environment.DATAVERSE_APP_URL?.trim();
  if (!appUrl) {
    throw new Error('DATAVERSE_APP_URL is required');
  }

  return { appUrl: validateDataverseAppUrl(appUrl) };
}

/**
 * Validate that a URL identifies an HTTPS model-driven application entry point.
 * Do not impose a cloud-specific hostname: sovereign and custom hosts vary.
 * Consumers must still point this at their approved Dataverse environment.
 */
export function validateDataverseAppUrl(input: string): string {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new Error('Dataverse app URL must be an absolute HTTPS URL');
  }

  if (url.protocol !== 'https:' || !url.hostname || url.username || url.password || url.hash) {
    throw new Error('Dataverse app URL must use HTTPS without credentials or a fragment');
  }

  if (!url.pathname.toLowerCase().endsWith('/main.aspx')) {
    throw new Error('Dataverse app URL must target /main.aspx');
  }

  if (!url.searchParams.get('appid') && !url.searchParams.get('appname')) {
    throw new Error('Dataverse app URL must specify an appid or appname query parameter');
  }

  return url.toString();
}
