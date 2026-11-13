/**
 * LOCAL ONLY: create a Playwright storageState file after a user signs into
 * an approved Dataverse model-driven app interactively.
 *
 * Run `npm run build`, install Chromium, and set DATAVERSE_APP_URL and
 * DATAVERSE_READY_SELECTOR first. Never upload or commit the resulting state.
 */
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { chromium } from '@playwright/test';
import {
  captureAuthenticatedState,
  loadDataverseConfig,
} from '../dist/index.js';

async function main() {
  if (process.env.CI || !stdin.isTTY) {
    throw new Error('Interactive authentication requires a local terminal, not CI.');
  }

  const config = loadDataverseConfig();
  const readySelector = process.env.DATAVERSE_READY_SELECTOR?.trim();
  if (!readySelector) {
    throw new Error(
      'DATAVERSE_READY_SELECTOR is required. Use a locator verified in your app.',
    );
  }

  const browser = await chromium.launch({ headless: false });
  const prompt = createInterface({ input: stdin, output: stdout });
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(config.appUrl, { waitUntil: 'domcontentloaded' });

    stdout.write(
      'Sign in using your organization-approved Entra ID method in the browser.\n',
    );
    await prompt.question(
      'After the intended app is fully loaded, press Enter to verify and save state: ',
    );

    // A product-specific, verified UI selector is required, not just the URL.
    // The readiness check alone may still be insufficient to establish
    // identity/role in some environments: validate your pilot flow.
    const savedPath = await captureAuthenticatedState(page, async () => {
      await page.locator(readySelector).waitFor({
        state: 'visible',
        timeout: 30_000,
      });
      const current = new URL(page.url());
      const approved = new URL(config.appUrl);
      if (current.origin !== approved.origin) {
        throw new Error('Browser is not on the configured Dataverse origin.');
      }
    });

    stdout.write(`Saved local authentication state to ${savedPath}.\n`);
    stdout.write(
      'This file contains session credentials. Keep it private and delete it after use.\n',
    );
  } finally {
    prompt.close();
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
