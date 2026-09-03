# Vendored first-party application packages

`dist/electron/UnPackaged/package.json` depends on two packages published by the project's own
organisation (zeeis) to the GitHub Packages npm registry, which requires a token even for public
packages. They are vendored here and referenced with `file:` specifiers so that `yarn unpackaged`
needs no registry credentials.

| File | Package | Version | SHA-256 | SRI (registry `dist.integrity`) | Size |
| --- | --- | --- | --- | --- | --- |
| `zeeis-alphabiz-account-0.0.89.tgz` | `@zeeis/alphabiz-account` | 0.0.89 | `<sha256-account>` | `<sri-account>` | `<size-account>` |
| `zeeis-alphabiz-libdb-0.0.97.tgz` | `@zeeis/alphabiz-libdb` | 0.0.97 | `<sha256-libdb>` | `<sri-libdb>` | `<size-libdb>` |

Verify: `cd vendor && shasum -a 256 -c SHA256SUMS` (also run by the CI hygiene job).

## Provenance

Downloaded unmodified on <date> with `npm pack <name>@<version> --registry=https://npm.pkg.github.com`
from the packages published by the zeeis organisation (sources: https://github.com/zeeis/alphabiz-account,
https://github.com/zeeis/alphabiz-libdb). The SRI value matches the registry's published
`dist.integrity` for each version. Both tarballs were extracted and scanned for credential and
private-key material before being committed (see the pull request that introduced this directory).
Neither tarball contains lifecycle install scripts. `alphabiz-libdb` declares a peer dependency on
`electron@17.0.0`; Yarn prints an unmet-peer warning that can be ignored (the app runs on the
custom Electron 21.3.3 runtime from `@zeeis/velectron`).

## Licensing

Both packages are first-party Alphabiz components written by the Alphabiz/zeeis team. Their
`package.json` files carry the npm template default `"license": "ISC"`; `alphabiz-libdb` ships the
GNU GPL v2 text as its LICENSE file and `alphabiz-account` ships no license file. As the copyright
holder, the Alphabiz project distributes both packages here under the same GPL-2.0 license as the
rest of this repository (see `../LICENSE`). This file is the authoritative statement for the
vendored copies.

## Notes for maintainers

- The tracked application bundles contain no `require` of either package name; the upstream
  application build bundles them. They are installed here so that `yarn unpackaged` resolves the
  manifest exactly as published.
- To update: replace the tarball, regenerate `SHA256SUMS`, update the table and the `file:`
  specifier in `dist/electron/UnPackaged/package.json`, and re-run the inspection steps described
  in CONTRIBUTING.md. Yarn Classic caches `file:` tarballs by name and version; after replacing a
  tarball with the same version run `yarn cache clean @zeeis/alphabiz-account` (or `-libdb`).
- Never commit `.npmrc`/`.yarnrc` files containing registry tokens anywhere in this repository.
