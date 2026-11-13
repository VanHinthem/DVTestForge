---
applyTo: "**/*.yml,**/*.yaml"
---
# Pipeline and release guidance

- Use reusable Azure Pipelines templates with parameterized test project paths, environments and commands.
- Depend on lockfiles and pinned tool/package versions; do not install global floating versions in production CI.
- Publish Playwright JUnit reports through Azure Pipelines and preserve failure artifacts using `condition: always()`.
- Treat screenshot/trace uploads as sensitive and apply approved retention policies.
- Clearly separate pipeline test publication from Azure Test Plans test-point/result synchronization.
- Never embed tokens, passwords, tenant identifiers or customer URLs in YAML; use approved secure variables/service connections.
- Framework publishing must not silently upgrade consumer repositories.
- Do not invent runnable pipeline commands before package structure and scripts exist.
