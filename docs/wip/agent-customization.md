# AI Agent Customization — Working Policy

Status: initial repository baseline, 2026-11-13.

## Goals

Keep AI-assisted contributions consistent, auditable and safe, while avoiding an unnecessarily large set of permanent instructions.

| Layer                    | Location                                 | Purpose                                          |
| ------------------------ | ---------------------------------------- | ------------------------------------------------ |
| Cross-agent rules        | `AGENTS.md`                              | Mission, boundaries, quality/safety guardrails   |
| Copilot repository rules | `.github/copilot-instructions.md`        | Always-on Copilot-specific context               |
| Path rules               | `.github/instructions/*.instructions.md` | TypeScript, pipelines and documentation          |
| Specialist agents        | `.github/agents/*.agent.md`              | Roles for architecture, Dataverse UI, Test Plans |
| On-demand skills         | `.github/skills/*/SKILL.md`              | Repeatable implementation and review workflows   |

## Roles and skills

- **framework-architect**: framework API, packaging and cross-repo compatibility.
- **dataverse-automation**: model-driven UI controls and resilient Playwright interactions.
- **testplans-integration**: Test Plans migration, case mapping and result synchronization.
- **dataverse-control**: workflow for adding a control.
- **gherkin-to-testplans**: safe and traceable Gherkin import.
- **playwright-test-authoring**: convert functional test cases into reviewable Playwright tests.
- **ado-results**: pipeline reporting and proven Test Plans association.

## Working agreement

- Code and documentation are English.
- Human review is required for AI-authored code, test conversions and integration changes.
- Use only approved test environments and identities; never store customer data or secrets in GitHub.
- Agents cannot assume they have tested functionality unless they have actually run checks.
- Track unverified external API/platform behavior explicitly.
- Keep skill files focused and update them based on observed issues; do not create unmaintainable instruction duplication.
- Agent/skill discovery depends on the installed Copilot/VS Code version, settings and available permissions; verify recognition in the intended IDE.

## Follow-up verification

1. In VS Code, confirm Copilot loads repository instructions, discovers custom agents and recognizes skills.
2. Ask the Dataverse agent to outline a form control and confirm it refuses to invent verified selectors.
3. Ask the Test Plans agent about Pipeline-vs-Test-Plans reporting and confirm it distinguishes them.
4. Validate a small PR against path-specific instructions and update based on observed behavior.
5. Review instructions periodically when architecture changes.

## Documentation references

- https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions
- https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills
- https://code.visualstudio.com/docs/agents/guides/customize-copilot-guide
