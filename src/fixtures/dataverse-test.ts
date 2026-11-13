import { test as base, expect } from '@playwright/test';
import { resolveAuthStatePath } from '../auth/dataverse-auth.js';
import { loadDataverseConfig, type DataverseConfig } from '../config/dataverse-config.js';
import { DataverseApp } from '../model-driven/dataverse-app.js';

export interface DataverseFixtures {
  readonly dataverseConfig: DataverseConfig;
  readonly dataverseApp: DataverseApp;
}

export interface DataverseTestOptions {
  /** Default: playwright/.auth/user.json. Treat this file as a secret. */
  readonly authStatePath?: string;
  /** Configuration injected by the consuming product test suite. */
  readonly environment?: NodeJS.ProcessEnv;
}

/**
 * Create a product-owned Playwright Test instance with an authenticated browser
 * context, a validated app configuration, and a model-driven app helper.
 *
 * This does NOT authenticate a user: create a valid state file before running
 * tests. Each consumer suite should import its own exported `test` instance.
 */
export function createDataverseTest(options: DataverseTestOptions = {}) {
  const authStatePath = resolveAuthStatePath(options.authStatePath);
  const environment = options.environment ?? process.env;

  return base.extend<DataverseFixtures>({
    storageState: authStatePath,
    dataverseConfig: async (_fixtures, use) => {
      await use(loadDataverseConfig(environment));
    },
    dataverseApp: async ({ page }, use) => {
      await use(new DataverseApp(page));
    },
  });
}

export { expect };
