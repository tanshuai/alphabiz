> 中文文档：[docs/README.md](../README.md#中文文档)

# Guide to build your own app based on Alphabiz

## Prerequisites

Currently Alphabiz supports developing `Windows (x86_64; arm64 MSI with WiX 3.14)` / `Linux (x86_64)` / `macOS (x86_64/arm64/universal)` apps. For macOS apps you need a macOS device or a macOS runner on GitHub Actions.

> We recommend using `Windows 10/11`, `Ubuntu 22.04+` or `macOS 12+` to build apps.

This repository uses two toolchains. Keep them apart when you read version numbers elsewhere in the repository:

- **Repository tooling and CI**: Node.js 22, Yarn Classic 1.22.22 via corepack (or `npx --yes yarn@1.22.22 <command>`); Yarn 2+ is not supported. This is what `.github/workflows/ci.yml` runs (`yarn install --ignore-scripts`, the security and release-metadata checks); it never rebuilds native modules and never packages the application.
- **Application build** (this guide): Yarn Classic 1.22.22; Python 3.7–3.11 (node-gyp 9.3 does not support Python 3.12 or newer); a C++ toolchain (Visual Studio Build Tools on Windows, Xcode Command Line Tools on macOS, `build-essential` on Linux); native modules are rebuilt for the `@zeeis/velectron` 21.3.3 runtime (the `electron` devDependency pin is overridden by the postinstall symlink). Node.js: the shipped releases were built with Node.js 16, which the former nightly pipeline pinned; newer Node.js versions have not been re-verified for the native module rebuild — if you build successfully on a newer version, please report it.

Before developing, you need to install:

- [Git](https://git-scm.com) — clone the repository; a downloaded source ZIP has no `.git` directory and fails at the `preunpackaged` step
- [Node.js](https://nodejs.org/en/download) — see the toolchain note above
- Yarn Classic 1.22.22 — `corepack enable && corepack prepare yarn@1.22.22 --activate`
- [Python](https://www.python.org/downloads/) 3.7–3.11
- [node-gyp](https://github.com/nodejs/node-gyp) with a working C++ compiler

For Windows you need:
- Visual Studio Build Tools
- [WiX Toolset](https://github.com/wixtoolset/wix3/releases) v3.11 (v3.14 for arm64 MSI); do not install WiX v4 or newer

See [windows](windows.md) for more details.

For Linux you need:
- build-essential
  ```sh
  sudo apt install build-essential
  ```
- snap, Snapcraft and Multipass (only needed for `yarn make:snap`)
  ```sh
  sudo apt install snapd
  ```
- [Snapcraft](https://snapcraft.io)
  ```sh
  sudo snap install snapcraft
  ```
- [Multipass](https://multipass.run)
  ```sh
  sudo snap install multipass
  ```

For macOS you need:
- [Xcode](https://developer.apple.com/xcode/) with Command Line Tools

## Fork and prepare your project

- Click the `Fork` button in the GitHub page, change the name to what you want, and then click `Create Fork` to fork this repo.
- Clone your forked repo to your local machine (clone it; do not download a source ZIP)
  ```sh
  git clone git@github.com:your_username/your_appname.git
  ```
- Install dependencies
  ```sh
  yarn
  yarn unpackaged
  ```

  Run both commands from the repository root. The application bundle depends on two packages
  published to GitHub Packages (`@zeeis/alphabiz-account`, `@zeeis/alphabiz-libdb`), and that
  registry requires a token even for public packages, so `yarn unpackaged` needs a GitHub personal
  access token with the `read:packages` scope in `~/.npmrc`:

  ```txt
  //npm.pkg.github.com/:_authToken=YOUR_TOKEN
  ```

  Put it in `~/.npmrc`, not in the repository's own `.npmrc`. The root `yarn` step reads the same
  file, because the `@zeeis/velectron` installer that fetches the custom Electron runtime looks
  there; the runtime itself is a public download, so an empty value on that line is enough for
  `yarn` alone. Never write a placeholder after `=`: a non-empty invalid token causes a 401.

  If you change `version` in package.json, set the same string as `newTagName` in
  release.json and keep `targetTagName` as `main`; otherwise `yarn unpackaged` stops
  with `Version mismatch`.

## Customize your app
- Edit [developer/app.js](../../developer/app.js) via your IDE.
- Edit [developer/assets](../../developer/assets) and [developer/platform-assets](../../developer/platform-assets) to change icons and other assets for your app.

There are some explanations for keys in `app.js`. The defaults below are transcribed from `developer/app.js`; entries marked **change before shipping** point at Alphabiz's own services or identities.

| Key | Default/Value | Description |
| --- | --- | --- |
| `name` | `'Alphabiz'` | Your app name. We recommend using only alphabet characters (a-z and A-Z) and at least 3 characters. |
| `displayName` | `'Alphabiz'` | A more general name used as the window title, process name and elsewhere in the app. |
| `fileName` | `'Alphabiz'` | Used to name installers. For macOS this should be up to 15 characters. |
| `description` | `'Alphabiz Blockchain Cryptocurrency Application'` | Description for your app. |
| `author` | `'Alphabiz Team <dev@alpha.biz>'` | Author. Commonly `YOUR_ORG_NAME <EMAIL>`. |
| `developer` | `'Alphabiz Team'` | Author name without special characters (`<` `>`, etc.). |
| `appId` | `'com.zeeis.alphabiz'` | Application ID for your mobile app (Android/iOS). |
| `appIdentifier` | `'org.zeeis.alphabiz'` | Bundle identifier for your macOS app (Mac App Store). `appId` and `appIdentifier` intentionally use different prefixes; use the identifiers you registered. |
| `snapName` | `'alphabiz'` (`name` in lower case) | Binary name of the snap package; it launches your app from a terminal. |
| `microsoftStoreProductId` | `'9PBCCV3MHK04'` | Microsoft Store product ID; **change or clear before shipping** — the default is Alphabiz's own listing. |
| `appxPackageIdentityName` | `'Alphabiz'` | Package identity name for the `appx` target. |
| `publisher` | `'CN=zeeis'` | Publisher subject for the external APPX signing certificate verified through the `ALPHABIZ_APPX_*` environment variables. |
| `publisherDisplayName` | `'Alphabiz Team'` | Publisher display name for the `appx` target. |
| `upgradeCode` | `'4d8a65aa-fc5b-421c-94ab-cb722ef737e2'` | UUID the MSI target uses to recognise the same app across versions; **change before shipping** (run `npx uuid v4`), otherwise Windows treats your app and Alphabiz as the same product. |
| `homepage` | `'https://alpha.biz'` | Official site for your app (also written into the `.deb` metadata). |
| `webEditionUrl` | `'https://web.alpha.biz'` | URL of the web edition the app links to. |
| `protocol` | `'alphabiz'` (`name` in lower case) | URL protocol that opens your app (`alphabiz://`). |
| `shortProtocol` | `'ab'` | Short protocol with the same purpose as `protocol` (`ab://`). |
| `versionsUrl` | `'https://raw.githubusercontent.com/tanshuai/alphabiz/main/versions.json'` | URL of the `versions.json` that controls force-update; **change before shipping** — point it at your own repository. |
| `twitterAccount` | `'@alphabiz_app'` | Your official Twitter account. |
| `register` | `{ mode: 'none', list: [] }` | Which countries can register accounts in your app: `mode` is `'none'`, `'blacklist'` or `'whitelist'`; `list` holds ISO 3166-1 alpha-2 codes. |
| `library.recommends` | `{ default: ['fxpebrsi9ij5pzinwdky', 'cut44dbbfxjpqka39qix'], 'zh-CN': ['vs52l0yqtqqpqtw33ycx', 'cut44dbbfxjpqka39qix'] }` | Channel IDs auto-selected as recommended channels, keyed by `navigator.language`. The defaults are Alphabiz's channels; **change or empty them before shipping**. |
| `update` | `require('./update')` | Update sources; see [About app update](#about-app-update). |
| `takedown` | `require('./take-down')` | Take-down administrators and presets; see [About library take-down](#about-library-take-down). |
| `theme` | `Object` | Colors for your app. See [Theme Builder](https://m3.material.io/theme-builder) and the color tools in the development panel. |
| `dynamicConfig` | `require('./dynamicConfig')` | Runtime configuration; `remote.url` defaults to Alphabiz's endpoint (`alpha.biz/app/remote_config`), **change before shipping**. See [Dynamic configs](#dynamic-configs). |
| `communities` | `[{ enable: true, url: 'https://github.com/tanshuai/alphabiz', icon: 'https://github.githubassets.com/favicons/favicon.svg' }]` | Community links shown next to the version label (a drop-down list when there is more than one); `enable: false` hides an entry without removing it. The default links to this repository; **change before shipping**. |
| `externalI18n` | `'https://raw.githubusercontent.com/tanshuai/alphabiz/main/i18n'` | Raw URL of the external i18n directory loaded at boot; **change before shipping** — otherwise your app loads Alphabiz's translations. See [About external i18n](#about-external-i18n). |
| `LIBDB_NAME` | `'Alphabiz'` (`app.name`) | Not a key of the exported object: `app.js` sets `global.LIBDB_NAME = app.name`, and `alphabiz-libdb` uses it as the internal library category so that different builds keep separate libraries. Append a suffix if two of your builds share one `name`. |

There are icons used by app
```tree
developer/
├── assets/
|   └── icon-256.png                      # APP icon
├── icons/
|   ├── favicon-16x16.png                 # MSI installer icon
|   └── favicon-32x32.png                 # MSI installer icon
├── platform-assets/
|   ├── linux/
|   |   └── 512x512.png                   # DEB installer icon
|   ├── mac/
|   |   ├── app.icns                      # Mac installer icon
|   |   ├── background.png                # DMG installer background
|   |   ├── dmg-background.tiff           # DMG installer background
|   |   ├── trayiconTemplate.png          # Mac tray icon (Recommend black-and-white)
|   |   └── volume-icon.icns              # DMG installer volume icon (macOS <= 11)
|   └── windows/
|   |   ├── icon.ico                      # Windows icon
|   |   ├── icon/
|   |   |   ├── Square150x150Logo.png     # APPX installer icon
|   |   |   ├── Square44x44Logo.png       # APPX installer icon
|   |   |   └── Square44x44Logo.targetsize-44_altform-unplated.png    # APPX tray icon
|   |   └── splash/
|   |   |   ├── InstallSplash.gif         # EXE(Squirrel) installer gif
|   |   |   ├── background_493x312.png    # MSI installer background
|   |   |   └── banner_493x58.png         # MSI installer banner
├── favicon.ico                           # App favicon
└── icon-1024.png                         # Windows tray icon
```

## Build your app

Run these from the repository root, after `yarn` and `yarn unpackaged`:

```sh
yarn packager
yarn make
```

Platform notes:

- **Windows** — plain `yarn make` currently requires the `ALPHABIZ_APPX_*` signing variables described in [windows.md](windows.md#about-appx-target) and exits before packaging anything when they are missing; `yarn make:win` builds the EXE and MSI and then fails at its final `make:appx` step for the same reason. For unsigned EXE and MSI installers run `yarn make:squirrel && yarn make:msi` instead (the MSI step needs WiX on your `PATH`).
- **macOS** — the DMG is unsigned unless `APPLE_ID` is set; the `premake:dmg` step skips signing without it, and users of an unsigned DMG see a Gatekeeper warning. A universal build needs both the x64 and the arm64 packager output first (`BUILD_ARCH=x64` and `BUILD_ARCH=arm64`); `./build-scripts/macos/app/build.sh` and `./build-scripts/macos/dmg/build.sh` run the three builds in order. For Mac App Store builds see [build-mac.md](build-mac.md).
- **Linux** — `yarn make` produces a `.deb`, which needs the optional dependencies: install with plain `yarn`, not `yarn --ignore-optional`. `yarn make` does not build a snap; run `yarn make:snap` (needs snapd, Snapcraft and Multipass), or `yarn make:snap:ci` inside containers and CI runners where Multipass is unavailable (it builds with LXD).

After building Windows installers, some files are modified by the build scripts.

- build-scripts/windows/appx/template.xml
- package.json

You can reset the changes by running
```sh
git restore FILE_NAME
```

or running
```sh
node build-scripts/common/make.js --reset
```

You can find installers in `out/installers/VERSION`.

## About customizations

Almost every value in `developer/app.js` can be changed to your own ones. The `developer/validateAppConfig.js` will automatically check the values, ensuring that all of them are valid values.

View comments in `developer/app.js` for more information.

### About app update

You can edit `developer/update.js` to tell your app how to check and download updates. Currently we support using `GitHub` and `Amazon S3`.

You can use the `versionsUrl` to configure force-update. The default URL points at the `versions.json` file in the root directory of this repository (`main` branch); point it at your own repository before shipping.
```json
{
  "min": {
    "stable": "0.1.1",
    "nightly": "0.1.1-nightly-202205301917",
    "internal": "0.1.1-internal-202205301821"
  }
}
```

### About registration-limit

You can configure who can register an account for your app by editing the `register` entry. The default value of `mode` is `"none"`, which means anyone can register. You can use `"blacklist"` or `"whitelist"` mode.

### Dynamic configs

The `developer/dynamicConfig.js` includes some dynamic configs that can be changed at runtime.

The app first loads the `local` entry when it launches, and then makes a request to `remote.url` to get remote configs and saves them locally. The default `remote.url` is Alphabiz's endpoint; point it at your own before shipping.

### About library take-down

The `developer/take-down.js` includes configs to take down users, channels or posts in the media library. This can help you manage user-created contents in your app. Replace the contents of `admins` with your own pubkey(s); the shipped list starts with the upstream Alphabiz administrator key, which in the default `committee` mode keeps a take-down vote in your app until you remove it. Type `lib.user.is.pub` in the main-process devtools console to print your own pubkey.

The `developer/take-down.json` includes presets for taken-down contents.

## About external i18n

You can edit the [i18n](../../i18n/README.md) directory in this repo to add more internationality files. These files will be loaded when the app boots, and can be updated without updating your app.

Point `externalI18n` in `developer/app.js` at your own repository's raw URL (for GitHub use the `raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/i18n` form, not `github.com/...`), otherwise your app loads Alphabiz's translations from this repository's `main` branch.

For more information, view the [README](../../i18n/README.md) file in `i18n`.

## About term-of-service

The default ToS file [here](../../developer/terms-of-service.md) uses `Alphabiz` as the app name, `Alphabiz Team` as the developer name and names `Tan Shuai` as the operator. Replace `Alphabiz`, `Alphabiz Team` and `Tan Shuai` with your own names before shipping.

You can use `Ctrl+F` to search or `Ctrl+H` to replace.

## Before you ship

Work through the [fork checklist](fork-checklist.md): the repository and update sources, `versionsUrl`, `externalI18n`, the Store product ID, `upgradeCode`, take-down admins, recommended channels, community links and the ToS names all default to Alphabiz's own values.
