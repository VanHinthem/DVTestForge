import { expect, test } from '@playwright/test';
import { loadDataverseConfig, validateDataverseAppUrl } from '../src/config/dataverse-config.js';

test('loads a direct HTTPS model-driven app URL', () => {
  const url = 'https://example.crm.dynamics.com/main.aspx?appid=sample-app';
  expect(loadDataverseConfig({ DATAVERSE_APP_URL: url }).appUrl).toBe(url);
});

test('accepts appname and case-insensitive main.aspx', () => {
  expect(
    validateDataverseAppUrl('https://example.crm.dynamics.com/main.aspx?appname=myapp'),
  ).toContain('appname=myapp');
});

test('rejects missing app URL', () => {
  expect(() => loadDataverseConfig({})).toThrow('DATAVERSE_APP_URL');
});

test('rejects unsafe or non-app URLs', () => {
  for (const url of [
    'http://example.crm.dynamics.com/main.aspx?appid=abc',
    'https://user:pass@example.crm.dynamics.com/main.aspx?appid=abc',
    'https://example.crm.dynamics.com/main.aspx',
    'https://example.crm.dynamics.com/main.aspx?appid=',
    'https://example.crm.dynamics.com/other?appid=abc',
    'https://example.crm.dynamics.com/main.aspx?appid=abc#fragment',
    'not a URL',
  ]) {
    expect(() => validateDataverseAppUrl(url)).toThrow();
  }
});
