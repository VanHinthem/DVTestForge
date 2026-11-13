import { expect, test, type Locator } from '@playwright/test';
import { DataverseForm } from '../src/model-driven/dataverse-form.js';

test('fills the supplied verified text locator', async () => {
  const calls: string[] = [];
  const field = {
    fill: async (value: string) => {
      calls.push(`fill:${value}`);
    },
  } as unknown as Locator;

  await new DataverseForm().fillText(field, 'Example project');

  expect(calls).toEqual(['fill:Example project']);
});

test('waits for caller-provided save verification', async () => {
  const calls: string[] = [];
  const saveCommand = {
    click: async () => {
      calls.push('click');
    },
  } as unknown as Locator;

  await new DataverseForm().saveAndVerify(saveCommand, async () => {
    calls.push('verified');
  });

  expect(calls).toEqual(['click', 'verified']);
});

test('propagates failed persistence verification', async () => {
  const saveCommand = {
    click: async () => undefined,
  } as unknown as Locator;

  await expect(
    new DataverseForm().saveAndVerify(saveCommand, async () => {
      throw new Error('Dataverse record was not saved');
    }),
  ).rejects.toThrow('Dataverse record was not saved');
});
