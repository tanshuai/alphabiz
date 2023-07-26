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
