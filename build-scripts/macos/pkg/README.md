# MAS(Mac App Store) package guide

First of all, read the official electron [build guide](https://www.electronjs.org/docs/latest/tutorial/mac-app-store-submission-guide) for Mac App Store.

## Environment variables

You are required to add these environment variables before you build .pkg target. You can manually `export` them in terminal, or add them to the `.env` file in the root directory.

```sh
# DEV=true
APP="Alphabiz"
BUILD_PLATFORM="mas"
PLATFORM="mas"
VERSION="0.2.1"
APPLE_DISTRIBUTION_KEY="Apple Distribution: Company Name (XXXXXXXXXX)"
APPLE_INSTALLER_KEY="3rd Party Mac Developer Installer: Company Name (XXXXXXXXXX)"
```

You can get your apple certificates from `XCode` => `Settings` => `Accounts` => `Manage Certificates`. On the left-bottom corner, click `+` and choose `Apple Development` `Apple Distribution` and `Mac Installer Distribution`.

You can find your certificates in `Keychain Access`. All of them should be trusted.

- Open `Keychain Access`, goto `My Certificates` and find your certificate to be used.
- Right-click the certificate and choose `Get Info`
- You will find the issuer of your certificate under `Issuer Name` with `Common Name` and `Organizational Unit`. e.g. `Apple Worldwide Developer Relations Certification Authority / G3`
- If the certificate is not trusted, go to [Apple's certificates download page](https://www.apple.com/certificateauthority/) and download the specific certificate(Usually can be found in `Apple Intermediate Certificates`) you need. e.g. `Worldwide Developer Relations - G3`
- Open the downloaded certificate file, and now your cetificate will be trusted.

You can get your certificate names by
```sh
$ security find-identity -v
```

## Generate .pkg

- Ensure you had run `build-scripts/macos/app/build.sh`.
- Check for `dist/electron/$APP-mas-universal/$APP.app/Contents/Info.plist`, you may need to modify this file later.
- The `CFBundleIdentifier` should be you app identifier.
- The `CFBundleVersion` and `CFBundleShortVersionString` should be your app version.
  - If you've failed to upload a version, you need to modify the `CFBundleVersion` for a new upload and sign it again.
- Run `build-scripts/macos/app/sign.sh`
- Run `build-scripts/macos/pkg/build.sh`

You will find the target .pkg file in `out/installers/$VERSION/$APP_mas_$VERSION.pkg`

Open the pkg installer, you will find a lock icon in the top-right corder. Click it, and you will get your sign certificate info.
