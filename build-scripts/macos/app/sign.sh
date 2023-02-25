#!/bin/sh
# Sign .app for releasing
# shellcheck source=../../common/set-env.sh
. "$(realpath "$0/../../../common/set-env.sh")"

# Go to root directory
echo "Current working directory: $(dirname "$(realpath "$0/../../..")")"
cd "$(dirname "$(realpath "$0/../../..")")"

ensureEnv "APP" "your app name"
ensureEnv "VERSION" "x.x.x"
# Maybe enable other targets in the future
ensureEnv "PLATFORM" "\"mas\""

ARM_PATH="dist/electron/$APP-$PLATFORM-arm64/$APP.app"
X64_PATH="dist/electron/$APP-$PLATFORM-x64/$APP.app"
UNV_PATH="dist/electron/$APP-$PLATFORM-universal/$APP.app"
# ENTITLEMENT="build-scripts/macos/app/entitlements.mas.plist"
if $IS_DEV; then
  echo "DEV $IS_DEV"
  DEBUG="electron-osx-sign"
else
  DEBUG=""
fi

ensureEnv "APPLE_DISTRIBUTION_KEY" "\"Apple Development: Company Name (XXXXXXXXXX)\""

# printf "\x1b[32m  Runing \x1b[36m DEBUG=* yarn electron-osx-sign --identity=%s %s\x1b[0m\n" "$APPLE_DISTRIBUTION_KEY" "$ARM_PATH"
printf "\x1b[32m  Runing \x1b[36m DEBUG=""$DEBUG"" node build-scripts/macos/app/sign.js %s %s\x1b[0m\n" "$ARM_PATH" "$APPLE_DISTRIBUTION_KEY"
sleep 1
# DEBUG="*" yarn electron-osx-sign --entitlements="$ENTITLEMENT" --identity="$APPLE_DISTRIBUTION_KEY" "$ARM_PATH"
DEBUG="$DEBUG" node build-scripts/macos/app/sign.js "$ARM_PATH" "${APPLE_DISTRIBUTION_KEY}"

# printf "\x1b[32m  Runing \x1b[36m DEBUG=* yarn electron-osx-sign --identity=%s %s\x1b[0m\n" "$APPLE_DISTRIBUTION_KEY" "$X64_PATH"
printf "\x1b[32m  Runing \x1b[36m DEBUG=""$DEBUG"" node build-scripts/macos/app/sign.js %s %s\x1b[0m\n" "$X64_PATH" "$APPLE_DISTRIBUTION_KEY"
sleep 1
# DEBUG="*" yarn electron-osx-sign --entitlements="$ENTITLEMENT" --identity="$APPLE_DISTRIBUTION_KEY" "$X64_PATH"
DEBUG="$DEBUG" node build-scripts/macos/app/sign.js "$X64_PATH" "${APPLE_DISTRIBUTION_KEY}"

# printf "\x1b[32m  Runing \x1b[36m DEBUG=* yarn electron-osx-sign --identity=%s %s\x1b[0m\n" "$APPLE_DISTRIBUTION_KEY" "$UNV_PATH"
printf "\x1b[32m  Runing \x1b[36m DEBUG=""$DEBUG"" node build-scripts/macos/app/sign.js %s %s\x1b[0m\n" "$UNV_PATH" "$APPLE_DISTRIBUTION_KEY"
sleep 1
# DEBUG="*" yarn electron-osx-sign --entitlements="$ENTITLEMENT" --identity="$APPLE_DISTRIBUTION_KEY" "$UNV_PATH"
DEBUG="$DEBUG" node build-scripts/macos/app/sign.js "$UNV_PATH" "${APPLE_DISTRIBUTION_KEY}"

sleep 1
printf "Done"
