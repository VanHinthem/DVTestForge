/** Stable automation metadata; this does not synchronize Azure Test Plans results. */
export function createTestCaseTag(testCaseId: number): string {
  if (!Number.isSafeInteger(testCaseId) || testCaseId <= 0) {
    throw new RangeError('Azure DevOps Test Case ID must be a positive safe integer.');
  }
  return `@TC${testCaseId}`;
}

/** Extracts an unambiguous Test Case ID from a Playwright tag. */
export function parseTestCaseTag(tag: string): number | null {
  const match = /^@TC([1-9]\d*)$/.exec(tag);
  if (!match) return null;
  const id = Number(match[1]);
  return Number.isSafeInteger(id) ? id : null;
}
