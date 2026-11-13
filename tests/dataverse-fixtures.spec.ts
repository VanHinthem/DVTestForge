import { expect, test } from '@playwright/test';
import { createDataverseTest } from '../src/fixtures/dataverse-test.js';

test('creates a product test instance without connecting to Dataverse', () => {
  const dataverseTest = createDataverseTest({
    authStatePath: 'playwright/.auth/example.json',
    environment: {
      DATAVERSE_APP_URL: 'https://example.crm.dynamics.com/main.aspx?appid=sample',
    },
  });

  expect(typeof dataverseTest).toBe('function');
  expect(typeof dataverseTest.extend).toBe('function');
});

test('rejects an empty state file name immediately', () => {
  expect(() => createDataverseTest({ authStatePath: ' ' })).toThrow(
    'Authentication state path must not be empty',
  );
});
