# Security Policy

## Supported versions

AlphaBiz is currently in a maintenance revival. Security fixes are developed
against the default branch. Published `0.3.x` and `0.2.x` artifacts are legacy
builds. They must not be assumed to receive security updates unless a release
is explicitly marked as supported.

| Version | Status |
| --- | --- |
| `main` | Security fixes accepted |
| Published `0.3.x` and `0.2.x` builds | Legacy; not supported |
| Older builds | Not supported |

## Legacy APPX signing notice

APPX artifacts published through `0.3.3` used development signing material
that has now been retired. Treat those APPX files as deprecated: do not install
them and do not add their publisher certificate to a trusted certificate
store. New APPX publication remains disabled until a replacement signing path
and signature-verification gate are in place.

## Report a vulnerability

Please use [GitHub private vulnerability reporting](https://github.com/tanshuai/alphabiz/security/advisories/new).
Do not open a public issue, pull request, or discussion for an undisclosed
vulnerability or exposed credential.

Include the affected version or commit, impact, reproduction steps or a proof
of concept, and any suggested mitigation. Remove personal data and unrelated
secrets from the report. We aim to acknowledge a complete report within seven
days, but response times may vary while the project is in maintenance mode.

If private vulnerability reporting is temporarily unavailable, contact the
maintainer through the GitHub profile without including exploit details and
ask for a private reporting channel.

## Credentials and signing material

Never commit certificates containing private keys, PFX/P12 files, private-key
PEM files, `.key` files, keystores, access tokens, or recovery material. APPX
signing certificates must remain outside the repository. Supply the path,
password, and approved SHA-256 fingerprint only through the step-scoped
`ALPHABIZ_APPX_*` environment variables. Run `yarn security:scan` and
`yarn security:test-appx` before submitting a pull request.

## Coordinated disclosure

Please allow time to validate and remediate a report before public disclosure.
We will coordinate a disclosure date and credit with the reporter when
practical. Never test against systems or accounts that you do not own or have
explicit permission to assess.
