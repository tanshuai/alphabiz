# Contributing to AlphaBiz

Thank you for helping maintain AlphaBiz. The project is currently focused on
security, build reliability, dependency maintenance, documentation, and small
well-tested fixes.

## Before you start

- Search existing issues and pull requests before opening a duplicate.
- Use [GitHub private vulnerability reporting](https://github.com/tanshuai/alphabiz/security/advisories/new)
  for security issues; never disclose an unpatched vulnerability publicly.
- Keep changes focused. Large feature work should begin with a proposal issue.
- Do not include credentials, private user data, generated signing material, or
  unrelated formatting changes.

## Development setup

The current CI baseline uses Node.js 22 and Yarn Classic 1.22.22 for frozen
dependency installation and test discovery. The complete legacy application
build is still under reproducibility review. Follow the platform prerequisites
in `docs/en_us/README.md` and `docs/en_us/windows.md`, then install dependencies:

```sh
corepack enable
corepack prepare yarn@1.22.22 --activate
yarn install --frozen-lockfile
```

If your Node distribution does not include Corepack, run the pinned Yarn CLI
through `npx --yes yarn@1.22.22` instead of silently using a newer Yarn major.

Run the credential gate and the tests relevant to your change:

```sh
yarn security:scan
yarn security:test-appx
```

Some packaging and end-to-end tests require platform tools or external test
services. The Cypress E2E runner requires OpenSSL to create its disposable
localhost certificate. State exactly what you ran and what you could not run in
the pull request. Do not mark a check as complete when it was skipped.

## Signing keys and local certificates

Never place PFX/P12 files, private-key PEM files, `.key` files, keystores, or
other signing credentials anywhere in the repository. For an APPX build, store
the certificate outside the checkout and set its path, password, and approved
SHA-256 fingerprint only for the packaging process. E2E tests generate a
temporary localhost certificate and clean it up automatically.

The public repository currently preserves packaged files, tooling,
documentation, and release history; it is not a complete unminified source
publication. Additional source publication follows a separate provenance,
secret, license, and privacy review.

## Pull requests

- Base the pull request on `main` and keep each commit reviewable.
- Explain the problem, the chosen solution, compatibility impact, and rollback
  path.
- Add or update tests and documentation when behavior changes.
- Keep lockfile changes deterministic and limited to the intended dependency
  updates.
- Confirm that `yarn security:scan` passes before requesting review.
- Resolve review conversations and ensure all required checks pass.

By contributing, you agree that your contribution is provided under the
repository's GPL-2.0 license.
