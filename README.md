# Alphabiz

**Web3 YouTube alternative: a fully decentralized media platform and blockchain-based marketplace.**
Alphabiz ships as a desktop application for Windows, macOS and Linux, as a hosted web edition, and as
an open-source framework for building your own branded app on the same core.

[Website](https://alpha.biz) · [Download](#download) · [Web edition](https://web.alpha.biz) ·
[Build your own branded app](#build-your-own-branded-app) · [Documentation](docs/README.md) · [中文文档](docs/README.md#中文文档)

[![CI](https://img.shields.io/github/actions/workflow/status/tanshuai/alphabiz/ci.yml?branch=main&label=CI)](https://github.com/tanshuai/alphabiz/actions/workflows/ci.yml)
[![CodeQL](https://img.shields.io/github/actions/workflow/status/tanshuai/alphabiz/codeql.yml?branch=main&label=CodeQL)](https://github.com/tanshuai/alphabiz/actions/workflows/codeql.yml)
[![Latest stable release](https://img.shields.io/github/v/release/tanshuai/alphabiz?label=stable)](https://github.com/tanshuai/alphabiz/releases/latest)
[![Downloads of the latest stable release](https://img.shields.io/github/downloads/tanshuai/alphabiz/latest/total?label=downloads%20%28latest%20stable%29)](https://github.com/tanshuai/alphabiz/releases/latest)
[![License: GPL-2.0](https://img.shields.io/github/license/tanshuai/alphabiz)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/tanshuai/alphabiz?style=flat)](https://github.com/tanshuai/alphabiz)

![Alphabiz desktop application](https://user-images.githubusercontent.com/92558550/211519797-4e766719-f6cf-420e-9e04-0057150c5c3a.jpg)

## What Alphabiz does

- **Marketplace** — publish, buy and share media on a credit system built with decentralized technologies.
- **P2P streaming** — media is delivered and streamed peer-to-peer.
- **Media player** — plays mainstream formats with subtitle support.
- **Framework** — fork this repository, edit `developer/app.js` and the assets, and build Windows, macOS and Linux installers under your own brand.

## Download

Current stable release: **0.3.3** (13 September 2024). The official download page,
<https://alpha.biz/download/>, serves these same files from this repository's GitHub Releases.

| Platform | Package |
| --- | --- |
| Windows 10/11 (x64) | [MSI installer](https://github.com/tanshuai/alphabiz/releases/download/0.3.3/alphabiz-0.3.3.msi) · [EXE installer](https://github.com/tanshuai/alphabiz/releases/download/0.3.3/alphabiz-0.3.3.exe) |
| macOS 11+ on Apple silicon | [DMG](https://github.com/tanshuai/alphabiz/releases/download/0.3.3/alphabiz-arm64-0.3.3.dmg) |
| macOS 11+ on Intel | [DMG](https://github.com/tanshuai/alphabiz/releases/download/0.3.3/alphabiz-x64-0.3.3.dmg) |
| Ubuntu 20.04+ / Debian (x64) | [DEB](https://github.com/tanshuai/alphabiz/releases/download/0.3.3/alphabiz-0.3.3.deb) · [.snap package](https://github.com/tanshuai/alphabiz/releases/download/0.3.3/alphabiz-0.3.3.snap) (`sudo snap install --dangerous alphabiz-0.3.3.snap`) |
| Any platform | [Web edition](https://web.alpha.biz) — runs in the browser, nothing to install |

Every file on the [0.3.3 release page](https://github.com/tanshuai/alphabiz/releases/tag/0.3.3) has a `.sha`
sidecar with its SHA-256 checksum; portable `.7z` archives and all earlier versions are there too.

> The `.appx` attached to 0.3.3 was signed with a development certificate that has since been retired.
> Do not add that certificate to a trusted certificate store; install the MSI or EXE instead.

A community-maintained, unaffiliated Arch Linux package, [alphabiz-bin](https://aur.archlinux.org/packages/alphabiz-bin), is also available on the AUR.

## Project at a glance (as of 2026-09-03)

- 1,215 GitHub stars and 385 forks; public repository since January 2022.
- 383 GitHub releases: 5 stable versions, 374 nightly builds published daily from January 2022 to August 2023, and 4 version prereleases; 116 releases have 100+ downloads each.
- Release 0.3.3 alone: more than 3,500 installer downloads across its Windows, macOS and Linux packages (live count in the badge above).
- [Softpedia](https://www.softpedia.com/get/Internet/File-Sharing/Alphabiz.shtml) lists Alphabiz 0.3.3 with an editor rating of 4.5/5 and a "100% CLEAN" certification.
- [22 pull requests merged in August 2026](https://github.com/tanshuai/alphabiz/pulls?q=is%3Apr+is%3Amerged+merged%3A2026-08-01..2026-08-31): security hardening, dependency fixes, least-privilege CI with CodeQL, and a release version contract.

## What this repository contains

This repository is Alphabiz's distribution point and its "build your own branded app" framework. The
application core (renderer and main process) is built from the upstream Alphabiz application repository
and shipped here as production bundles with each release; everything needed to brand, package and test an
app on that core lives here:

| Path | What it is |
| --- | --- |
| `dist/electron/UnPackaged/`, `dist/spa/` | Production application bundles (Electron main process and SPA) |
| `developer/` | Branding and behaviour: `app.js`, icons and platform assets, update channels, take-down policy, dynamic config, terms of service |
| `build-scripts/` | Installer builds: Squirrel EXE, MSI (WiX), APPX, DMG, DEB, Snap |
| `vendor/` | Vendored first-party packages (`@zeeis/alphabiz-account`, `@zeeis/alphabiz-libdb`) so a fork installs without a registry token |
| `i18n/` | External translations, loaded by installed apps at runtime from `main` |
| `test/` | Playwright, Cypress and Jest end-to-end and release tests |
| `scripts/security/`, `scripts/release/` | Credential scanning, dependency regression tests and the release version contract run by CI |
| `docs/` | Build and customization guides in English and 中文 |

## Build your own branded app

```sh
git clone https://github.com/<you>/<your-app>.git   # your fork, cloned with git (a source ZIP will not build)
cd <your-app>
yarn              # tooling and the custom Electron 21.3.3 runtime
yarn unpackaged   # the application bundle's dependencies (vendored, no registry token)
yarn packager     # assemble the app: dist/electron/<Name>-<platform>-<arch>
yarn make         # installers land in out/installers/<version>/
```

- Prerequisites, platform notes and toolchain versions: [build guide](docs/en_us/README.md) · [Windows](docs/en_us/windows.md) · [macOS / Mac App Store](docs/en_us/build-mac.md).
- Before you ship, work through the [fork checklist](docs/en_us/fork-checklist.md): update repository, `versionsUrl`, `externalI18n`, Store product ID, take-down admins, recommended channels and community links all default to Alphabiz's own values.
- Windows: an APPX needs a signing certificate supplied through `ALPHABIZ_APPX_*` ([details](docs/en_us/windows.md#about-appx-target)); for unsigned EXE and MSI installers run `yarn make:squirrel && yarn make:msi`.
- macOS: the DMG is unsigned unless `APPLE_ID` is set. Linux: `yarn make:snap` needs snapcraft and multipass.
- Changing `version` in `package.json`? Set the same value as `newTagName` in `release.json`; `targetTagName` stays `main`.

## Maintenance and release status

- **Stable:** [0.3.3](https://github.com/tanshuai/alphabiz/releases/tag/0.3.3) (2024-09-13) — the recommended download and what alpha.biz/download serves.
- **Preview:** [0.4.0-beta.1](https://github.com/tanshuai/alphabiz/releases/tag/0.4.0-beta.1) (2026-08-29) — a maintenance preview of `main` with no installers attached: August 2026 security, dependency and CI hardening plus a version and provenance contract for tagged releases.
- **Nightly channel:** 374 nightly builds published between January 2022 and August 2023 remain on the Releases page; the channel is paused.
- CI and CodeQL run on every push and pull request to `main`.

## Community and support

- Bugs and feature requests: [GitHub Issues](https://github.com/tanshuai/alphabiz/issues) · questions: [Discussions](https://github.com/tanshuai/alphabiz/discussions)
- Security vulnerabilities: [private vulnerability reporting](https://github.com/tanshuai/alphabiz/security/advisories/new) — never a public issue. See [SECURITY.md](SECURITY.md).
- Contributing: [CONTRIBUTING.md](CONTRIBUTING.md) · [Code of Conduct](CODE_OF_CONDUCT.md) · [Sponsor the project](https://github.com/sponsors/tanshuai)

## Source and licensing

Alphabiz is released under the [GNU General Public License v2](LICENSE). This repository holds the
production application bundles, the build and packaging system, the customization surface, tests,
translations and documentation; the application core is developed in the upstream Alphabiz application
repository and published here as built bundles with each release. Licensing or source questions: <ab@alpha.biz>.

## 中文

Alphabiz 是完全去中心化的媒体平台与区块链市场，也是可定制品牌的应用框架。中文构建与定制文档见
[docs/zh_cn](docs/zh_cn/)，索引见 [docs/README.md](docs/README.md#中文文档)。
