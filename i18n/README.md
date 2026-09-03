# Guide for external i18n

Alphabiz loads its translations from an external i18n directory at runtime, so language packs can be added or updated without shipping a new version of the app. This directory is the one Alphabiz itself loads; a fork points its app at its own copy (see [For forks](#for-forks)).

## Directory layout

- [`example/translations.json`](example/translations.json) is the canonical key set. `check.js` loads it (`require('./example/translations.json')`) and validates every locale directory against it: a locale must contain every key of the example, must not contain keys that are not in the example, and every `{variable}` placeholder in an example value must also appear in the translated value. The `example` directory itself is skipped by the check.
- [`example/dateTimeFormat.json`](example/dateTimeFormat.json) is the template for the optional date and time formats.
- The [en-GB](en-GB) directory contains configurations for en-GB.
- The [locales](locales) file lists the locale codes the app offers.

You can add your custom language in a directory named by its locale code. The locale codes are recommended to be [BCP-47 language tags](https://gist.github.com/typpo/b2b828a35e683b9bf8db91b5404f1bd1).

In each locale directory, `translations.json` is required, while `dateTimeFormat.json` is optional.

You can use `${displayName}` in translations and it will be replaced with the real display name at runtime.

## Registering a locale

After adding the i18n directory, you should also add the locale code to [locales](locales). Every line in the `locales` file starts with one locale code. You can add a label for the locale.

The app will fetch and read this file on startup and parse the locales in it. You can put `#` before a code in it to disable a language pack instead of removing its directory.

Example:

```
en-GB British English
# Anything after `#` will be recognized as comments
ja-JP Any label with spaces are ok # But label should be as short as possible
# The following line is same as `zh-CN zh-CN`
zh-CN

```

## Checking a locale

Run the checker from inside the `i18n/` directory (the script path below is relative to it):

```sh
cd i18n
node ./check.js            # check every locale directory against example/translations.json
node ./check.js ja-JP      # check one or more locale codes (create the directory first)
node ./check.js -O         # also write the fixes: add missing keys (copied from the example, still to be translated) and remove keys that are not in the example
```

`node ./check.js -O` also creates `translations.json` from the example in a locale directory that does not have one yet. Missing `{variable}` placeholders are only reported: fix them by hand, because the checker does not write a file that has a placeholder problem, even with `-O`. A locale is ready when the checker prints `This language is perfectly ready for publish!` for it.

## For forks

Installed apps read this directory at runtime from the URL in `externalI18n` in [`developer/app.js`](../developer/app.js). The default, `https://raw.githubusercontent.com/tanshuai/alphabiz/main/i18n`, loads Alphabiz's translations from the `main` branch of this repository, so a fork that keeps the default shows Alphabiz's strings, including any later change made here. Set `externalI18n` to your own repository's raw URL; for GitHub that is `https://raw.githubusercontent.com/<user>/<repo>/<branch>/i18n`, not a `github.com/.../blob/...` URL.

Two more files are fetched from GitHub at runtime in the same way. `developer/take-down.json` is loaded from `https://raw.githubusercontent.com/<github.username>/<github.repo>/<github.branch>/developer/take-down.json`, built from the `github` section of [`developer/update.js`](../developer/update.js), and `versionsUrl` in `developer/app.js` points at `versions.json`. Set `github.username`, `github.repo` and `github.branch` in `developer/update.js`, and `versionsUrl` in `developer/app.js`, to your own repository as well.
