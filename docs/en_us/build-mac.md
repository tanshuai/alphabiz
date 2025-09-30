# Guild to build macOS .app .dmg and mas target

## One-command maker

```sh
./build-scripts/macos/app/build.sh
```

This command will build mac `.app` and `.dmg` files, both with `x86_64`, `arm64` and `universal` targets. If you want to build specific version, read the sh file for more details.

## CodeSign for mas(Mac App Store)

First of all, read the official electron [build guide](https://www.electronjs.org/docs/latest/tutorial/mac-app-store-submission-guide) for Mac App Store.

You need to save the provisioning profile (see [here](https://www.electronjs.org/docs/latest/tutorial/mac-app-store-submission-guide#prepare-provisioning-profile)) as `developer/embedded.provisionprofile` before building MAS target.

Before building MAS target, you need to put a `.env` file in root directory of this project and at least include these things:

```sh
# Set DEV=true to print build logs
DEV=false
# The app name should be same as the `displayName` in `developer/app.js`
# and `productName` in `package.json`.
APP="Alphabiz"
# Platform should be `mas` for Mac App Store, or `darwin` for 3rd party package.
BUILD_PLATFORM="mas"
# This overrides `version` in `package.json`
VERSION="0.2.4"
# Increase this value everytime for a new submission to MAS.
BUILD_BUNDLE="1"
# The distribution key you get from App Store Connect
APPLE_DISTRIBUTION_KEY="Apple Distribution: YOUR NAME (XXXXXXXXX)"
APPLE_INSTALLER_KEY="3rd Party Mac Developer Installer: YOUR NAME (XXXXXXXXX)"
APPLE_TEAM_ID="XXXXXXXXX"

```

You can find your distribution and installer keys by:

```sh
security find-identity -v
# Will print something like:
1) SOME_UID_HERE "Apple Distribution: YOUR NAME (XXXXXXXXX)"
2) OTHER_UID_HERE "3rd Party Mac Developer Installer: YOUR NAME (XXXXXXXXX)"
    2 valid identities found
```

It is simple to build MAS target by just running:

```sh
./build-scripts/macos/pkg/build.sh
```

The build script for MAS will automatically build `.app` targets, sign the `universal` app, and then create a `pkg` installer signed with MAS distribution certification.

The script will also verify package if you include `APPLE_ID` and `APPLE_ASP`(App Specific Password) in `.env`.

You can find your MAS package at `out/installers/VERSION/VERSION.pkg`. It is recommended to upload it through [Transporter](https://apps.apple.com/us/app/transporter/id1450874784).

### Troubleshooting

```log
Warning: unable to build chain to self-signed root for signer "YOUR_IDENTITY"
```

- Open `Keychain Access`, goto `My Certificates` and find your certificate to be used.
- Right-click the certificate and choose `Get Info`
- You will find the issuer of your certificate under `Issuer Name` with `Common Name` and `Organizational Unit`. e.g. `Apple Worldwide Developer Relations Certification Authority / G3`
- Go to [Apple's certificates download page](https://www.apple.com/certificateauthority/) and download the specific certificate(Usually can be found in `Apple Intermediate Certificates`) you need. e.g. `Worldwide Developer Relations - G3`
- Open the downloaded certificate file, and now your cetificate will be trusted.

NOTE: DO NOT set `Always Trust` to your certificate!
