# Dataverse Form Automation — First Component

Status: initial implementation candidate; **not validated against a live Dataverse environment**.

## Goal

Add the smallest useful, composable form helper to the central Playwright TypeScript package. It does not depend on EasyRepro, Selenium, SpecFlow, or external Dynamics-specific Playwright libraries.

## Initial API

- `fillText(field: Locator, value: string)`: fills a consumer-provided, verified text field.
- `expectTextValue(field: Locator, expected: string)`: asserts the UI value, not a saved database value.
- `saveAndVerify(saveCommand: Locator, verifySaved: () => Promise<void>)`: clicks save, then awaits an explicit caller-provided completion assertion.

This API requires locators to be verified in the actual model-driven app. It intentionally makes **no assumptions** about internal Dynamics `data-id` formats, labels, iframe structures, or forms.

## Example (illustrative; selectors require validation)

```ts
import { test, expect } from '@playwright/test';
import { DataverseForm } from 'dvtestforge-framework';

test('create a project', async ({ page }) => {
  const form = new DataverseForm();
  const name = page.getByRole('textbox', { name: 'Project Name', exact: true });
  const save = page.getByRole('button', { name: 'Save', exact: true });

  await form.fillText(name, 'Example project');
  await form.expectTextValue(name, 'Example project');
  await form.saveAndVerify(save, async () => {
    await expect(page.getByText('Record saved', { exact: true })).toBeVisible();
  });
});
```

The sample above is not a proven Dynamics UI flow; control accessibility, save feedback and selector strategy must be validated against an approved test app. A UI success notification is not always proof of persisted business state; use a Dataverse API verification when the requirement needs it.

## Tests and validation

Unit-level tests mock Playwright locator actions, verify ordering and error propagation. These tests **do not** prove actual Dynamics UI compatibility.

## Next increments

1. Introduce an authenticated pilot environment and verify selectors with a real model-driven form.
2. Add explicit, tested text/choice/lookup adapters rather than guessing a universal field selector.
3. Add field state assertions, save/error notifications, and robust asynchronous state checks.
4. Add fixtures and an end-to-end pilot verifying Dataverse persistence.
5. Document supported controls and observed platform variations.
