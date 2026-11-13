import type { Page } from '@playwright/test';
import type { DataverseConfig } from '../config/dataverse-config.js';

/**
 * Opens a known model-driven app directly, bypassing the app switcher.
 *
 * A caller-provided readiness assertion is required; a successful navigation
 * alone cannot tell whether Entra redirected to a sign-in page.
 */
export class DataverseApp {
  constructor(private readonly page: Page) {}

  async open(
    config: DataverseConfig,
    verifyReady: () => Promise<void>,
  ): Promise<void> {
    await this.page.goto(config.appUrl, { waitUntil: 'domcontentloaded' });
    await verifyReady();
  }
}
