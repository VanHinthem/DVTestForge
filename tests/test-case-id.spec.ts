import { test, expect } from '@playwright/test';
import { createTestCaseTag, parseTestCaseTag } from '../src/index.js';

test('generates a stable Azure DevOps Test Case tag', () => {
  expect(createTestCaseTag(12345)).toBe('@TC12345');
  expect(parseTestCaseTag('@TC12345')).toBe(12345);
});

test('rejects invalid test case identifiers', () => {
  expect(() => createTestCaseTag(0)).toThrow(RangeError);
  expect(() => createTestCaseTag(-1)).toThrow(RangeError);
  expect(() => createTestCaseTag(1.5)).toThrow(RangeError);
  expect(parseTestCaseTag('@TC0')).toBeNull();
  expect(parseTestCaseTag('@TC1-extra')).toBeNull();
  expect(parseTestCaseTag('@TC9999999999999999999')).toBeNull();
});
