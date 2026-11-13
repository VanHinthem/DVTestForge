import { expect, type Locator } from '@playwright/test';

/**
 * Small, selector-agnostic form interaction helper.
 *
 * Consumers supply verified locators for their model-driven app. The framework
 * deliberately does not assume internal Dynamics 365 DOM attributes.
 */
export class DataverseForm {
  /**
   * Fill an editable text input. Playwright itself waits for actionability.
   * This method does not assert that the record has been persisted.
   */
  async fillText(field: Locator, value: string): Promise<void> {
    await field.fill(value);
  }

  /** Verify the current UI input value (not server-side persistence). */
  async expectTextValue(field: Locator, expected: string): Promise<void> {
    await expect(field).toHaveValue(expected);
  }

  /**
   * Click the supplied save control and wait for a caller-defined completion
   * assertion. An application-specific completion signal is mandatory: a click
   * alone cannot prove a Dataverse record was saved successfully.
   */
  async saveAndVerify(saveCommand: Locator, verifySaved: () => Promise<void>): Promise<void> {
    await saveCommand.click();
    await verifySaved();
  }
}
