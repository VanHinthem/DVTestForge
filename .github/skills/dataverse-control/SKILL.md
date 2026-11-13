---
name: dataverse-control
description: Build, test, or review a reusable Playwright TypeScript control for Dataverse model-driven forms, grids, lookups, command bars, tabs or business process flows.
---
# Dataverse control implementation playbook

Use this skill when adding or fixing model-driven app UI controls.

1. Define the user-visible interaction and supported control variants; do not build a universal abstraction without evidence.
2. Inspect an actual supported UI instance, accessible roles and DOM; document selector evidence. If UI access is unavailable, mark locators as hypotheses and provide a verification task.
3. Implement a small, strictly typed, composable API built on Playwright `Page` / `Locator`.
4. Prefer role, label or reliable data attributes scoped to the control. Treat Dynamics `data-id` conventions as version/control-dependent.
5. Use Playwright auto-waiting and `expect` to observe readiness and completion. Avoid fixed sleeps and hidden global page state.
6. Provide errors that distinguish missing control, ambiguous locator, unsupported field type and timeout.
7. Test happy path, invalid/missing control, locale/format variations where relevant, and repeatability.
8. Add a minimal consumer example and note control variants actually verified.

Never take Microsoft sample UI toolkit as a runtime dependency; licensing review is required before copying any source code.
