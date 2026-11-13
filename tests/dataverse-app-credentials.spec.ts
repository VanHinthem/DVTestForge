import { expect, test } from '@playwright/test';
import {
  acquireDataverseAppToken,
  probeDataverseAppIdentity,
} from '../src/auth/dataverse-app-credentials.js';

const credentials = {
  tenantId: '12345678-1234-1234-1234-123456789abc',
  clientId: 'client-id',
  clientSecret: 'unit-test-secret',
  dataverseUrl: 'https://example.crm4.dynamics.com',
};

test('requests an app-only token with the Dataverse API scope', async () => {
  const token = await acquireDataverseAppToken(credentials, async (input, init) => {
    expect(input).toBe(
      'https://login.microsoftonline.com/12345678-1234-1234-1234-123456789abc/oauth2/v2.0/token',
    );
    expect(init?.method).toBe('POST');
    const body = init?.body as URLSearchParams;
    expect(body.get('grant_type')).toBe('client_credentials');
    expect(body.get('scope')).toBe('https://example.crm4.dynamics.com/.default');
    return new Response(JSON.stringify({ access_token: 'fake-token' }), { status: 200 });
  });
  expect(token).toBe('fake-token');
});

test('does not echo identity-provider error responses', async () => {
  await expect(
    acquireDataverseAppToken(credentials, async () => {
      return new Response('sensitive server detail', { status: 401 });
    }),
  ).rejects.toThrow('Entra app-token request failed (HTTP 401)');
});

test('rejects malformed tenant IDs before sending credentials', async () => {
  await expect(
    acquireDataverseAppToken({ ...credentials, tenantId: '../common' }, async () => {
      throw new Error('Should not send a request');
    }),
  ).rejects.toThrow('tenantId must be a GUID');
});

test('probes Dataverse WhoAmI without writing data', async () => {
  await probeDataverseAppIdentity(
    credentials.dataverseUrl,
    'fake-token',
    async (input, init) => {
      expect(input).toBe('https://example.crm4.dynamics.com/api/data/v9.2/WhoAmI()');
      expect(init?.method).toBe('GET');
      expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer fake-token');
      return new Response('{}', { status: 200 });
    },
  );
});
