# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2026-09-06

### Added

- Vercel Web Analytics and Speed Insights on the hosted demo, for aggregate traffic and performance measurements only. Cookie headers, cookie values, simulator inputs, and scenario data are never intentionally sent as analytics properties — documented in a new README Privacy section.

## [0.1.0] - 2026-09-06

### Added

- Initial public release: a standards-oriented `Set-Cookie` simulator covering parsing, acceptance, effective storage, request matching, and JavaScript accessibility.
- A pure TypeScript rule engine (no React) for Domain scope, Path matching and default-path computation, `Max-Age`/`Expires` precedence, schemeful registrable-domain-aware `SameSite`, and the `__Secure-` / `__Host-` / `__Http-` / `__Host-Http-` cookie prefixes — fully unit tested.
- A workspace UI with a raw header input and a synchronized field-by-field builder, set-context and request-context forms, a lifecycle diagram, stored-cookie table, and request/JavaScript-access results with explanatory findings.
- Presets covering common and intentionally invalid configurations.
- Shareable scenarios encoded in the URL hash, plus copy-link and copy-header actions.
- A visual identity built on the Lucide `Cookie` icon, a favicon, a generated Open Graph card, and Open Graph/Twitter metadata.
- A GitHub Actions CI workflow running lint, typecheck, tests, and build on every push and pull request.

[0.1.1]: https://github.com/Randy-R-code/cookie-checkup/releases/tag/v0.1.1
[0.1.0]: https://github.com/Randy-R-code/cookie-checkup/releases/tag/v0.1.0
