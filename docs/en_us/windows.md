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

The `appx` installer is a wrapper for Universal Windows Platform apps (aka Microsoft Store apps). To build this target you need generate a `pfx` certificate.

The simplest way is remove `devCert` in `build-scripts/common/forge.config.js`.

```js
    // ...
    {
      name: '@electron-forge/maker-appx',
      config: {
        // ...
        // devCert: appxPfx, // Comment this line
        // ...
      }
    }
    // ...
```

Then run `yarn make`. The build script will ask you to create a certificate when building `appx` installer. The generated file will be saved to `out/make/appx/x64/default.pfx`, you can copy it to `developer/appx.pfx` replacing the default one.

There is also a way to create certificate using `openssl`.

```sh
cd %temp%
openssl req -newkey rsa:2048 -nodes -keyout 0.key -x509 -days 365 -out appx.cer
openssl pkcs12 -export -in appx.cer -inkey 0.key -out appx.pfx
cp appx.pfx path/to/your/project/developer/
```

> After create your certificate, double-click it and choose trust for it.
