---
name: gherkin-to-testplans
description: Migrate legacy Gherkin feature files into Azure DevOps Test Plan test cases while preserving functional intent, metadata, traceability and re-import safety.
---

# Gherkin to Test Plans migration

Use when building or reviewing an importer.

1. Parse Gherkin structurally, rather than with line-based regular expressions alone.
2. Preserve the original feature path, scenario identity, tags, `Background`, `Scenario Outline`, `Examples`, data tables and expected results.
3. Propose a documented mapping: feature -> suite/group, scenario -> Test Case, Given -> setup/preconditions, When -> action, Then -> expected result. Review grouped steps with consultants.
4. Decide intentionally between expansion and parameterization of examples; preserve per-example traceability.
5. Generate stable migration keys and store the source mapping to make re-imports idempotent; never create duplicate cases silently.
6. Provide dry-run/diff mode and explicit approval before modifying Azure DevOps work items.
7. Avoid overwriting manually edited Test Cases without conflict detection. Keep the original Gherkin as provenance, not a competing maintained specification.
8. Test multiline data, escaped values, translated keywords, tags, repeated titles and partial failures.

Deliver: mapping rules, sample input/output, validation report and unresolved cases.
