# Guide to dev/build windows app

> Before reading this doc please read [README](README.md)

## Prerequisites

Ensure you have installed [git](https://git-scm.com), [Python](https://www.python.org/downloads/) 3.7–3.11 (node-gyp 9.3 does not support Python 3.12 or newer) and [Node.js](https://nodejs.org/en/download), and added them to your PATH. Two toolchains apply, see the [README prerequisites](README.md#prerequisites): repository tooling and CI use Node.js 22 with Yarn Classic 1.22.22; the application build uses Yarn Classic 1.22.22 and rebuilds native modules for the `@zeeis/velectron` 21.3.3 runtime. The shipped releases were built with Node.js 16; newer Node.js versions have not been re-verified for the native module rebuild — if you build successfully on a newer version, please report it.

You'll need [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/?q=build+tools) to build app. The `.Net Frameworks` and `C++ Desktop Development` are required.

We recommend using Yarn Classic as your package manager. Node.js ships corepack, so enable the pinned version by running `corepack enable && corepack prepare yarn@1.22.22 --activate` (or run commands through `npx --yes yarn@1.22.22`); Yarn 2+ is not supported.

(Optional) You can install `@quasar/cli` for dev.
```sh
yarn global add @quasar/cli
```

## `msi` target

For building MSI installers, you should also install [WiX Toolset](https://github.com/wixtoolset/wix3/releases) v3.11 and add the install path to your PATH. The default install path should be something like `C:\Program Files (x86)\WiX Toolset v3.11\bin`. Do not install WiX v4 or newer: the MSI maker used here needs the v3 tools.

### MSI for Arm64

Normally you will get `3.11` from WiX's website, but this version does not support `arm64`.

The `arm64` support was added in `3.14`, which is published on the WiX v3 GitHub releases page rather than on the WiX website.

Download it from [github.com/wixtoolset/wix3/releases](https://github.com/wixtoolset/wix3/releases): tag `wix3141rtm` (WiX Toolset v3.14.1; `wix314rtm` is v3.14.0).

## About `appx` target

The `appx` installer is a wrapper for Universal Windows Platform apps (also
known as Microsoft Store apps). Every APPX build must use an explicitly
configured signing certificate. This repository does not contain a default or
test signing key.

Plain `yarn make` and `yarn make:win` currently require the `ALPHABIZ_APPX_*`
variables shown below: the certificate is checked before packaging, so without
them `yarn make` exits immediately and `yarn make:win` fails at its first step.
For an unsigned build, `yarn make:msi` works on its own because it reads the
packager output from `dist/electron/` directly. The Squirrel EXE maker instead
reads Forge's `out/` directory, which `yarn make` normally fills from
`dist/electron/`, so copy it there first:

```powershell
robocopy dist\electron\Alphabiz-win32-x64 out\Alphabiz-win32-x64 /E
yarn make:squirrel
```

Store a password-protected PFX outside the repository. Provide its absolute
path, password, and approved SHA-256 certificate fingerprint for the current
process:

```powershell
$env:ALPHABIZ_APPX_PFX_PATH = "$env:TEMP\alphabiz-signing.pfx"
$env:ALPHABIZ_APPX_PFX_PASSWORD = Read-Host "PFX password"
$env:ALPHABIZ_APPX_CERT_SHA256 = "AA:BB:...:FF"
yarn make:appx
```

The certificate subject must match `publisher` in `developer/app.js`. The
preflight check rejects relative paths, missing files, non-PFX files,
certificates inside the repository, empty passwords, fingerprint mismatches,
and the retired development certificate. The APPX maker is not added to
the Forge configuration unless all three values pass verification, so a direct
Forge command cannot fall back to an automatically generated certificate.

For local development, create a disposable self-signed certificate in a
temporary directory or use Windows certificate tooling. Delete the exported
PFX and any intermediate private-key files when testing is complete. Never
copy a PFX, PEM private key, `.key`, or keystore into the project directory.

In CI, materialize the PFX from a protected secret under the runner's temporary
directory. Set the path, password, and approved fingerprint only for the
packaging step. Verify the resulting APPX signer independently and remove the
PFX in an `always()` cleanup step. Do not upload an APPX when certificate setup
or signature verification fails.
