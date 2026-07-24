# Guide to dev/build windows app

> Before reading this doc please read [README](README.md)

## Prerequisites

Ensure you have installed [git](https://git-scm.com), [python3](https://www.python.org/downloads/) and [nodejs](http://nodejs.org) >= 16 and added them to your PATH.

You'll need [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/?q=build+tools) to build app. The `.Net Frameworks` and `C++ Desktop Development` are required.

We recommend using `yarn` as your package manager. Since `node.js` 16+ it it bundled in node, and you can enable yarn by just running `corepack enable`.

(Optional) You can install `@quasar/cli` for dev.
```sh
yarn global add @quasar/cli
```

## `msi` target

For building MSI installers, you should also install [WiX Toolset](https://wixtoolset.org) and add the install path to your PATH. The default install path should be something like `C:\Program Files (x86)\WiX Toolset v3.11\bin`.

### MSI for Arm64

Normaly you will get `3.11` from Wix's website, but this version does not support `arm64`.

The `arm64` support was added since `3.14`, which is not released to github.

You can download above version from [here](https://wixtoolset.org/docs/v3/releases/v3-14-0-6526/).

## About `appx` target

The `appx` installer is a wrapper for Universal Windows Platform apps (also
known as Microsoft Store apps). Every APPX build must use an explicitly
configured signing certificate. This repository does not contain a default or
test signing key.

Store the PFX outside the repository and provide its absolute path for the
current process:

```powershell
$env:ALPHABIZ_APPX_PFX_PATH = "$env:TEMP\alphabiz-signing.pfx"
yarn make:appx
```

The certificate subject must match `publisher` in `developer/app.js`. The
preflight check rejects relative paths, missing files, non-PFX files, and any
certificate located inside the repository. A full Windows release (`yarn
make`) also fails before packaging when the variable is missing, so CI cannot
upload an APPX created with an unknown or interactive fallback certificate.

For local development, create a disposable self-signed certificate in a
temporary directory or use Windows certificate tooling. Delete the exported
PFX and any intermediate private-key files when testing is complete. Never
copy a PFX, PEM private key, `.key`, or keystore into the project directory.

In CI, materialize the PFX from a protected secret under the runner's temporary
directory, set `ALPHABIZ_APPX_PFX_PATH` only for the packaging step, verify the
resulting signature, and remove the file in an `always()` cleanup step. Do not
upload an APPX when certificate setup or signature verification fails.
