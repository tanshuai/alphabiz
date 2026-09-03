# Security Policy

## Supported versions

| Version | Status |
| --- | --- |
| `main` | Security fixes are developed and merged here first |
| 0.3.x (current stable line; latest 0.3.3, September 2024) | Supported — reports are triaged against 0.3.3 and fixes ship in the next release |
| 0.2.x and older | Not supported — upgrade to the current stable release |

Two facts to weigh when assessing 0.3.3: it was built in September 2024, before the August 2026
hardening of this repository, which changed build tooling, CI and dependency manifests and added
runtime-boundary hardening to the tracked application bundle on `main` (pull requests #46–#48); the
hardened bundle ships in the next release. The migration of locally encrypted data from CryptoJS 3.x
to 4.x is tracked in [issue #41](https://github.com/tanshuai/alphabiz/issues/41) and is deliberately
not applied until read-compatibility is demonstrated.

## Retired development signing certificate (APPX)

Until August 2026 this repository tracked a self-signed development certificate used to sign locally
built APPX packages (SHA-256 fingerprint `986AAE60A0B76AD7A28E8BBBBC479B7E8B2564F86A33060513EC350FC22D6035`).
That certificate has been removed and retired. Do not add it to a trusted certificate store and do not
sideload an APPX signed with it; install 0.3.3 from the MSI or EXE on the Releases page instead. Local
APPX builds now require an externally supplied certificate whose path, password and approved
fingerprint are passed through the `ALPHABIZ_APPX_*` environment variables (`docs/en_us/windows.md`);
the build rejects the retired fingerprint. This notice concerns APPX packages signed with that
certificate only.

## Report a vulnerability

Please use [GitHub private vulnerability reporting](https://github.com/tanshuai/alphabiz/security/advisories/new).
Do not open a public issue, pull request, or discussion for an undisclosed
vulnerability or exposed credential.

Include the affected version or commit, impact, reproduction steps or a proof
of concept, and any suggested mitigation. Remove personal data and unrelated
secrets from the report. We aim to acknowledge a complete report within seven
days.

If private vulnerability reporting is temporarily unavailable, contact the
maintainer through the GitHub profile without including exploit details and
ask for a private reporting channel.

## Automated checks

CodeQL (security-extended) runs on every push and pull request to `main` and on a weekly schedule;
Dependabot opens weekly dependency and Actions updates; the CI hygiene job scans every tracked file
for private-key material (`yarn security:scan`), rejects workflow files that reference repository
secrets or unpinned actions. Open findings are
triaged in the repository's Security tab.

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
