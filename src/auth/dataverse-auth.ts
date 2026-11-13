import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import type { Page } from '@playwright/test';

/** The recommended local auth-state file; ignored by Git. */
export const DEFAULT_AUTH_STATE_PATH = 'playwright/.auth/user.json';

/** Resolve a path so consumers can pass it to Playwright's storageState option. */
export function resolveAuthStatePath(
  path: string = DEFAULT_AUTH_STATE_PATH,
): string {
  if (!path.trim()) {
    throw new Error('Authentication state path must not be empty');
  }
  return resolve(path);
}

/**
 * Persist browser auth state only after the caller has verified login.
 *
 * Login itself is deliberately delegated to an approved Entra ID flow.
 * This avoids embedding usernames, passwords or MFA bypasses in the package.
 * Auth state contains sensitive credentials: never commit or upload it.
 */
export async function captureAuthenticatedState(
  page: Page,
  verifyAuthenticated: () => Promise<void>,
  path: string = DEFAULT_AUTH_STATE_PATH,
): Promise<string> {
  const authFile = resolveAuthStatePath(path);
  await verifyAuthenticated();
  await mkdir(dirname(authFile), { recursive: true });
  await page.context().storageState({ path: authFile });
  return authFile;
}
