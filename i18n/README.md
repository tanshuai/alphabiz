# Guide for external i18n

The example [en-GB](en-GB) directory contains configurations for en-GB.

You can add your custom language in a directory named by locale codes. The locale codes are recommended to be [BCP-47 language tags](https://gist.github.com/typpo/b2b828a35e683b9bf8db91b5404f1bd1).

The [translations.json](en-GB/translations.json) is required, while [dateTimeFormat.json](en-GB/dateTimeFormat.json) is optional.

You can use `${displayName}` in translations and it will be replaced with real display name in runtime.

After adding the i18n directory, you should also add the locale code to [locales](locales). Every line in `locales` file should starts with one locale code. You can add a label for the locale.

The app will fetch and read this file on startup and parse locales in it. You can just add `#` before a code in it to disable a language pack instead of remove its directory.

Example:

```
en-GB British English
# Anything after `#` will be recognized as comments
ja-JP Any label with spaces are ok # But label should be as short as possible
# The following line is same as `zh-CN zh-CN`
zh-CN

```
