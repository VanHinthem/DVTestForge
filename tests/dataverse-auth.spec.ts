import { expect, test, type Page } from '@playwright/test';
import { captureAuthenticatedState, resolveAuthStatePath } from '../src/auth/dataverse-auth.js';

test('rejects empty auth state paths', () => {
  expect(() => resolveAuthStatePath('   ')).toThrow();
});

test('verifies login before saving browser state', async () => {
  const order: string[] = [];
  const page = {
    context: () => ({
      storageState: async ({ path }: { path: string }) => {
        expect(path).toContain('playwright');
        order.push('save');
        return { cookies: [], origins: [] };
      },
    }),
  } as unknown as Page;

  await captureAuthenticatedState(
    page,
    async () => {
      order.push('verified');
    },
    'playwright/.auth/unit-test.json',
  );

  expect(order).toEqual(['verified', 'save']);
});

test('does not persist state if login verification fails', async () => {
  let saved = false;
  const page = {
    context: () => ({
      storageState: async () => {
        saved = true;
        return { cookies: [], origins: [] };
      },
    }),
  } as unknown as Page;

  await expect(
    captureAuthenticatedState(page, async () => {
      throw new Error('Not authenticated');
    }),
  ).rejects.toThrow('Not authenticated');
  expect(saved).toBe(false);
});
