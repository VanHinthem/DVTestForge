import { expect, test, type Page } from '@playwright/test';
import { DataverseApp } from '../src/model-driven/dataverse-app.js';

test('navigates to the supplied app and then checks readiness', async () => {
  const events: string[] = [];
  const url = 'https://example.crm.dynamics.com/main.aspx?appid=abc';
  const page = {
    goto: async (target: string, options: { waitUntil: string }) => {
      expect(target).toBe(url);
      expect(options.waitUntil).toBe('domcontentloaded');
      events.push('navigated');
      return null;
    },
  } as unknown as Page;

  await new DataverseApp(page).open({ appUrl: url }, async () => {
    events.push('ready');
  });

  expect(events).toEqual(['navigated', 'ready']);
});

test('propagates errors when app does not become ready', async () => {
  const page = {
    goto: async () => null,
  } as unknown as Page;

  await expect(
    new DataverseApp(page).open({ appUrl: 'https://example.com/main.aspx?appid=x' }, async () => {
      throw new Error('Sign-in redirect or app unavailable');
    }),
  ).rejects.toThrow('Sign-in redirect or app unavailable');
});
