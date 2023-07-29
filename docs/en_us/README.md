# Guide to build your own app based on Alphabiz

## Prerequisites

Currently Alphabiz supports developing `Windows(x86_64)`/`Linux(x86_64)`/`macOS(x86_64/arm64/universal)` apps. For macOS app you may need a macOS device or building app by `Github Actions`.

> We recommends using `Windows 10/11`/`Ubuntu 18.04+`/`macOS 12+` to build apps.

Before developing, you need to install:

- Git
- [NodeJS](http://nodejs.org) >= 16
- Yarn >= 1.21
- Python >= 3.7
- [node-gyp](https://github.com/nodejs/node-gyp)

For windows you need:
- Visual Studio Build Tools
- [WiX Toolset](https://wixtoolset.org) 3.11

See [windows](windows.md) for more details.

For Linux you need:
- build-essential
  ```sh
  sudo apt install build-essential
  ```
- snap
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
- [XCode](https://developer.apple.com/xcode/) with Command Line Tools

## Fork and prepare your project

- Click the `Fork` button in github page, change the name to what you want, and then click `Create Fork` to fork this repo.
- Clone your forked repo to your local machine
  ```sh
  git clone git@github.com:your_username/your_appname.git
  ```
- Installing dependencies
  ```sh
  yarn
  yarn unpackaged
  ```

## Customize your app
- Edit [developer/app.js](developer/app.js) via your IDE.
- Edit [developer/assets](developer/assets) and [developer/platform-assets](developer/platform-assets) to change icons and other assets for your app.

There are some explainations for keys in `app.js`.

| Key | Default/Value | Description |
| --- | --- | --- |
| `name` | `"Alphabiz"` | Your app name. We recommend using only alphabet characters(a-z and A-Z) and at lease 3 characters. |
| `displayName` | `"Alphabiz"` | This name is a more general name that will be used as title, process name and other that you can find in app. |
| `fileName` | `"Alphabiz"` | This name is used to build installers. For macOS this should be up to 15 characters. |
| `description` | `String` | Description for your app |
| `author` | `"Alphabiz Team <dev@alpha.biz>"` | Author name. Commonly is `YOUR_ORG_NAME <EMAIL>` |
| `developer` | `"Alphabiz Team"` | Author name without special characters(`<` `>`, etc.) |
| `appId` | `"com.zeeis.alphabiz"` | The appid for your mobile app (iOS/Android) |
| `appIdentifier` | `"com.zeeis.alphabiz"` | The appid for your mac app |
| `microsoftStoreProductId` | `String` | The appid for your win store app |
| `appxPackageIdentityName` | `"Alphabiz"` | The appid for your appx target|
| `publisher` | `"CN=zeeis"` | The publisher name of your `appx.pfx` used to publish windows store app |
| `publisherDisplayName` | `"Alphabiz Team"` | The publisher name for win store |
| `upgradeCode` | `String` | An uuid used by msi target to identify same app.<br> Run `npx uuid v4` to generate your owns |
| `homepage` | `"https://alpha.biz"` | Your official site for your app |
| `protocol` | `"alphabiz"` | The universal link protocol that can open your app |
| `shortProtocol` | `"ab"` | A short protocol same as `protocol` |
| `versionsUrl` | `String` | An url to a `versions.json` that can controls force-update |
| `twitterAccount` | `"@alphabiz"` | Your official twitter account |
| `register` | `Object` | Configure users in which areas can register accounts in your app |
| `theme` | `Object` | Colors for your app. See [Theme Builder](https://m3.material.io/theme-builder) and color tools in development pannel |

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
|   |   |   ├── InstallSplash.gif         # EXE(Squirel) installer gif
|   |   |   ├── background_493x312.png    # MSI installer background
|   |   |   └── banner_493x58.png         # MSI installer banner
├── favicon.ico                           # App favicon
└── icon-1024.png                         # Windows tray icon
```

## Build your app

```sh
yarn packager
yarn make
```

For building Mac App Store app, see [this document](build-mac.md).

After building Windows installers, some files are modified by the build scripts.

- appx/template.xml
- package.json

You can use reset the changes by running
```sh
git reset FILE_NAME
```

or running
```sh
node make --reset
```

You can find installers in `out/installers/VERSION`.

## About customizations

Almost every value in `developer/app.js` can be changed to your own ones. The `developer/validateAppConfig.js` will automatically check the values, ensuring that all of them are valid values.

View comments in `developer/app.js` for more information.

### About app update

You can edit `developer/update.js` to tell your app how to check and download updates. Currently we supports using `Github` and `Amazon S3`.

You can use the `versionsUrl` to configure force-update. The default url links to `versions.json` file in root directory of this repo.
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

The app first loads `local` entry when launch, and then makes a request to `remote.url` to get remote configs and saves to local.

### About library take-down

The `developer/take-down.js` includes configs to take-down users, channels or posts for media library. This can help you manage user-created contents in your app. You need to create your own account and copy your account pub key to `admins` to add permission for your.

The `developer/take-down.json` includes presets for take-downed contents.

## About external i18n

You can edit the [i18n](../../i18n/README.md) directory in this repo to add more internationality files. These files will be loaded when app boot, and can be updated without updating your app.

For more information, view the [README](../../i18n/README.md) file in `i18n`.

## About term-of-service

The default ToS file [here](../../developer/terms-of-service.md) uses `Alphabiz` as app name and `Alphabiz Team` as developer name. You need to change them manually.

You can use `Ctrl+F` to search or `Ctrl+H` to replace.
