# Contributing to Alphabiz

Thank you for contributing to Alphabiz. Contributions to packaging and build
scripts, `developer/` defaults and validation, documentation (English and
中文), translations, end-to-end tests, security regression scripts and
dependency maintenance are welcome, as are bug reports and feature proposals
for the application; large feature work should start with a proposal issue.

## Before you start

- Search existing issues and pull requests before opening a duplicate.
- Use [GitHub private vulnerability reporting](https://github.com/tanshuai/alphabiz/security/advisories/new)
  for security issues; never disclose an unpatched vulnerability publicly.
- Keep changes focused.
- Do not include credentials, private user data, generated signing material, or
  unrelated formatting changes.

## Development setup

There are two ways to work on this repository.

### Path 1 — tooling, docs, scripts and CI (what CI runs)

No native toolchain, no Electron download, no registry token. This mirrors `.github/workflows/ci.yml`:

```sh
corepack enable && corepack prepare yarn@1.22.22 --activate   # or: npx --yes yarn@1.22.22 <command>
CYPRESS_INSTALL_BINARY=0 ELECTRON_SKIP_BINARY_DOWNLOAD=1 PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
  yarn install --frozen-lockfile --ignore-scripts --ignore-optional --non-interactive
yarn security:scan && yarn security:test-scan && yarn security:test-appx && yarn security:test-codeql
yarn test:release --listTests --runInBand
```

CI uses Node.js 22 and Yarn Classic 1.22.22 for this path (Yarn 2+ is not supported: Classic lockfile
and hoisted `node_modules`). It never runs `postinstall`, `electron-rebuild` or a packaging step.

### Path 2 — build the application

Follow the prerequisites in `docs/en_us/README.md` (Node.js, Yarn Classic 1.22.22, Python 3.7–3.11 —
the node-gyp 9.3 resolved in the lockfile does not support Python 3.12+ — a C++ toolchain, WiX 3.11
on Windows), then:

```sh
yarn && yarn unpackaged && yarn packager && yarn make      # from the repository root
```

The application bundle depends on two packages published to GitHub Packages
(`@zeeis/alphabiz-account`, `@zeeis/alphabiz-libdb`); that registry requires a token even for public
packages, so `yarn unpackaged` needs a personal access token with the `read:packages` scope on the
`//npm.pkg.github.com/:_authToken=` line of your `~/.npmrc` — not the repository's own `.npmrc`. The
root `yarn` step reads the same file because the `@zeeis/velectron` installer looks there, but the
custom Electron runtime is a public download, so an empty value on that line is enough for `yarn`
alone. Never write a placeholder after `=`, because a non-empty invalid token causes a 401. Do not install with `--ignore-optional` on this path (`.deb` builds need the optional
dependencies). State the toolchain you built with in your pull request; see the build guide for what
has been verified. The Cypress end-to-end runner (`yarn test:e2e`) needs OpenSSL on `PATH` to create
and clean up its disposable localhost certificate.

## Registry credentials

Never add a token to any `.npmrc` or `.yarnrc` inside the repository — the registry line belongs in
your own `~/.npmrc`. Removing the GitHub Packages requirement from the build is tracked separately.

## Signing keys and local certificates

Never place PFX/P12 files, private-key PEM files, `.key` files, keystores, or
other signing credentials anywhere in the repository. For an APPX build, store
the certificate outside the checkout and set its path, password, and approved
SHA-256 fingerprint only for the packaging process. E2E tests generate a
temporary localhost certificate and clean it up automatically.

## Where the code lives

This repository holds the packaging, customization, documentation, translation
and test surface of Alphabiz together with the production application bundles;
the application core is developed in the upstream Alphabiz application
repository and delivered here as bundles. Report application bugs here —
maintainers carry fixes upstream and publish the rebuilt bundle.

## Pull requests

- Base the pull request on `main` and keep each commit reviewable.
- Explain the problem, the chosen solution, compatibility impact, and rollback
  path.
- Add or update tests and documentation when behavior changes.
- Keep lockfile changes deterministic and limited to the intended dependency
  updates.
- Confirm that `yarn security:scan` passes before requesting review.
- State exactly what you ran and what you could not run; do not mark a check as
  complete when it was skipped.
- Resolve review conversations and ensure all required checks pass.

By contributing, you agree that your contribution is provided under the
repository's GPL-2.0 license.
