<p align="center">
  <img src="https://raw.githubusercontent.com/tanshuai/alphabiz/main/alphabiz-icon-1024.png" width="120" alt="Alphabiz">
</p>

<h1 align="center">Alphabiz</h1>

<p align="center"><strong>The open-source Web3 YouTube alternative — a fully decentralized media platform and blockchain-based marketplace.</strong></p>

<p align="center">
  Stream over P2P. Publish without gatekeepers. Trade media on a credit system.<br>
  Ships as a desktop app for Windows, macOS and Linux, a web edition, and a framework for launching <em>your own</em> branded app on the same core.
</p>

<p align="center">
  <a href="#-download">Download</a> ·
  <a href="https://web.alpha.biz">Try it in the browser</a> ·
  <a href="#-build-your-own-branded-app">Build your own app</a> ·
  <a href="docs/README.md">Docs</a> ·
  <a href="docs/README.md#中文文档">中文文档</a> ·
  <a href="https://alpha.biz">alpha.biz</a>
</p>

<p align="center">
  <a href="https://github.com/tanshuai/alphabiz/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/tanshuai/alphabiz/ci.yml?branch=main&label=CI" alt="CI"></a>
  <a href="https://github.com/tanshuai/alphabiz/actions/workflows/codeql.yml"><img src="https://img.shields.io/github/actions/workflow/status/tanshuai/alphabiz/codeql.yml?branch=main&label=CodeQL" alt="CodeQL"></a>
  <a href="https://github.com/tanshuai/alphabiz/releases/latest"><img src="https://img.shields.io/github/v/release/tanshuai/alphabiz?label=stable" alt="Latest stable release"></a>
  <a href="https://github.com/tanshuai/alphabiz/releases/latest"><img src="https://img.shields.io/github/downloads/tanshuai/alphabiz/latest/total?label=downloads%20%28latest%20stable%29" alt="Downloads of the latest stable release"></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/tanshuai/alphabiz" alt="License: GPL-2.0"></a>
  <img src="https://img.shields.io/github/stars/tanshuai/alphabiz?style=flat" alt="GitHub stars">
  <img src="https://img.shields.io/github/forks/tanshuai/alphabiz?style=flat" alt="GitHub forks">
</p>

![Alphabiz desktop application](https://user-images.githubusercontent.com/92558550/211519797-4e766719-f6cf-420e-9e04-0057150c5c3a.jpg)

## ✨ Why Alphabiz

Video platforms decide what gets published, who gets paid, and where you are allowed to watch. Alphabiz is built so that none of that needs a middleman:

- **Publish freely.** Movies, music, publications and software go straight from creator to audience — no platform approval, no regional lockout.
- **Stream at full speed.** Content is delivered peer-to-peer, so downloads scale with the swarm instead of one server's upload pipe.
- **Search the world.** A global, decentralized library that works without a proxy.
- **Earn by sharing.** Spare bandwidth and disk space earn **AB credits (α)**, the platform's own unit of exchange.

## 🚀 What's inside

| | |
| --- | --- |
| 🎬 **Media player** | Plays the mainstream formats on a custom Electron build with extra codecs; full subtitle support including styled ASS/SSA. |
| 🌐 **P2P streaming engine** | WebTorrent with DHT, trackers and NAT traversal (NAT-PMP and UPnP) — watch while you download. |
| 🛒 **Decentralized marketplace** | Publish, price and trade media on a credit system; seed-phrase wallets keep the keys with the user. |
| 📚 **Media library** | Channels, recommendations and a community take-down process with committee voting instead of a single moderator. |
| 🌍 **17 languages out of the box** | Plus language packs the app loads at runtime, so translations ship without a new release. |
| 🔄 **Update channels** | Stable, nightly and internal channels served from GitHub or S3, with a remote config the app refreshes on launch. |
| 🖥️ **Every desktop** | Windows (EXE, MSI, APPX), macOS (DMG, Mac App Store), Linux (DEB, Snap) — and a web edition at [web.alpha.biz](https://web.alpha.biz). |
| 🧩 **A framework, not just an app** | Fork, edit one config file, and ship installers under your own brand — the same core, your product. |

## ⬇️ Download

**Current stable release: 0.3.3.** The official download page, [alpha.biz/download](https://alpha.biz/download/), serves these same files straight from this repository's GitHub Releases.

| Platform | Get it |
| --- | --- |
| **Windows** 10/11 (x64) | [MSI installer](https://github.com/tanshuai/alphabiz/releases/download/0.3.3/alphabiz-0.3.3.msi) · [EXE installer](https://github.com/tanshuai/alphabiz/releases/download/0.3.3/alphabiz-0.3.3.exe) |
| **macOS** 11+ · Apple silicon | [DMG](https://github.com/tanshuai/alphabiz/releases/download/0.3.3/alphabiz-arm64-0.3.3.dmg) |
| **macOS** 11+ · Intel | [DMG](https://github.com/tanshuai/alphabiz/releases/download/0.3.3/alphabiz-x64-0.3.3.dmg) |
| **Linux** · Ubuntu 20.04+ / Debian (x64) | [DEB](https://github.com/tanshuai/alphabiz/releases/download/0.3.3/alphabiz-0.3.3.deb) · [.snap](https://github.com/tanshuai/alphabiz/releases/download/0.3.3/alphabiz-0.3.3.snap) (`sudo snap install --dangerous alphabiz-0.3.3.snap`) |
| **Arch Linux** | [`alphabiz-bin`](https://aur.archlinux.org/packages/alphabiz-bin) on the AUR (community-maintained) |
| **Any platform** | [Web edition](https://web.alpha.biz) — nothing to install |

Every file on the [release page](https://github.com/tanshuai/alphabiz/releases/tag/0.3.3) has a `.sha` sidecar with its SHA-256 checksum. Portable `.7z` archives and every earlier version are there too.

> The `.appx` attached to 0.3.3 was signed with a development certificate that has since been retired. Do not add that certificate to a trusted certificate store — install the MSI or EXE instead.

## 📈 By the numbers

<sub>As of 2026-09-03. Live counters are in the badges above.</sub>

| | |
| --- | --- |
| ⭐ **1,215** stars · 🍴 **385** forks | public since January 2022 |
| 📦 **383** releases | 5 stable versions, a daily nightly channel through 2022–2023, and 116 releases with 100+ downloads each |
| ⬇️ **3,500+** installer downloads of 0.3.3 | across Windows, macOS and Linux packages |
| 🏅 **4.5 / 5** editor rating | from an independent review on [Softpedia](https://www.softpedia.com/get/Internet/File-Sharing/Alphabiz.shtml) |
| 🔧 **22** pull requests merged in August 2026 | security hardening, dependency fixes, least-privilege CI with CodeQL, a release version contract — [see them](https://github.com/tanshuai/alphabiz/pulls?q=is%3Apr+is%3Amerged+merged%3A2026-08-01..2026-08-31) |
| 🗣️ **17** built-in languages | and runtime-loadable language packs |

## 🧩 Build your own branded app

Alphabiz is designed to be forked. Everything about the product you ship — name, icons, colours, protocol scheme, update channel, recommended channels, take-down policy, terms — lives in [`developer/`](developer/). Change one file, run four commands, and you have Windows, macOS and Linux installers for *your* app:

```sh
git clone https://github.com/<you>/<your-app>.git   # clone your fork with git (a source ZIP will not build)
cd <your-app>
yarn              # tooling and the custom Electron runtime
yarn unpackaged   # the application bundle's dependencies (needs a read:packages token — see the build guide)
yarn packager     # assemble the app: dist/electron/<Name>-<platform>-<arch>
yarn make         # installers land in out/installers/<version>/
```

- **Start here:** the [build guide](docs/en_us/README.md), then [Windows](docs/en_us/windows.md) and [macOS / Mac App Store](docs/en_us/build-mac.md) notes.
- **Before you ship:** the [fork checklist](docs/en_us/fork-checklist.md) — identifiers, runtime URLs, take-down admins and community links all default to Alphabiz's own values until you change them.
- **Signing:** APPX needs a certificate via `ALPHABIZ_APPX_*` ([how](docs/en_us/windows.md#about-appx-target)); DMGs are unsigned unless `APPLE_ID` is set.
- **Versioning:** bump `version` in `package.json` and `newTagName` in `release.json` together; `targetTagName` stays `main`.

## 🔬 Under the hood

| Layer | What it is |
| --- | --- |
| Runtime | [`@zeeis/velectron`](https://github.com/zeeis/velectron) — Electron 21.3.3 built with extra video codecs |
| UI | Quasar 1 / Vue 2, `video.js` with `libjass` subtitle rendering |
| Networking | WebTorrent, `bittorrent-dht`, `bittorrent-tracker`, NAT-PMP / UPnP, LZMA-compressed metadata |
| Data | [GUN](https://gun.eco) for the decentralized library graph; `electron-store` locally |
| Packaging | electron-packager + electron-forge: Squirrel, WiX MSI, APPX, DMG, DEB, Snapcraft |
| Testing | Playwright and Cypress end-to-end suites, Jest release tests |
| Automation | CI, CodeQL and Dependabot on every push and pull request; credential scanning in the hygiene job |

### Repository layout

| Path | Purpose |
| --- | --- |
| `dist/electron/UnPackaged/`, `dist/spa/` | The production application bundles (Electron main process and SPA) that every installer is built from |
| `developer/` | The customization surface: `app.js`, icons, platform assets, update channels, take-down policy, dynamic config, terms |
| `build-scripts/` | Installer builds for all seven targets |
| `i18n/` | Language packs installed apps load at runtime |
| `test/` | Playwright, Cypress and Jest suites |
| `scripts/security/`, `scripts/release/` | Credential scanning, dependency regression tests and the release version contract |
| `docs/` | Guides in English and 中文 |

The application core (renderer and main process) is developed in the upstream Alphabiz application repository and lands here as built bundles with each release; this repository is where it becomes a product — yours or ours.

## 🗺️ What's next

- **CryptoJS 4 migration** with full compatibility for existing encrypted data ([#41](https://github.com/tanshuai/alphabiz/issues/41)).
- **Automated release pipeline** — build, checksum, sign and publish every tagged release from CI.

Have an idea? [Open a discussion](https://github.com/tanshuai/alphabiz/discussions).

## 🤝 Contributing

Contributions are welcome and there is a place for every kind:

- 🌍 **Translate** — add a language pack under [`i18n/`](i18n/README.md); no build required.
- 📝 **Document** — the guides live in [`docs/`](docs/README.md) in English and 中文.
- 📦 **Package** — installer targets, signing flows and build scripts in [`build-scripts/`](build-scripts/).
- 🧪 **Test** — end-to-end and release suites in [`test/`](test/).
- 🐛 **Report** — [issues](https://github.com/tanshuai/alphabiz/issues) for bugs and feature requests, [discussions](https://github.com/tanshuai/alphabiz/discussions) for everything else.

Read [CONTRIBUTING.md](CONTRIBUTING.md) for setup and pull-request expectations, and the [Code of Conduct](CODE_OF_CONDUCT.md). If Alphabiz is useful to you, consider [sponsoring the project](https://github.com/sponsors/tanshuai).

## 🔒 Security

Please report vulnerabilities through [private vulnerability reporting](https://github.com/tanshuai/alphabiz/security/advisories/new), never in a public issue. Supported versions, the retired-certificate notice and our automated checks are in [SECURITY.md](SECURITY.md).

## 📄 License

Alphabiz is free software under the [GNU General Public License v2](LICENSE). Licensing or source questions: <ab@alpha.biz>.

---
