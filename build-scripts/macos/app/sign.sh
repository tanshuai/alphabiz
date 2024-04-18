#!/bin/sh
# Sign .app for releasing
source "$(realpath "$0/../../../common/set-env.sh")"

# Go to root directory
echo "Current working directory: $(dirname "$(realpath "$0/../../..")")"
cd "$(dirname "$(realpath "$0/../../..")")"

ensureEnv "APP" "your app name"
ensureEnv "VERSION" "x.x.x"
# Maybe enable other targets in the future
ensureEnv "PLATFORM" "\"mas\""

ARM_PATH="dist/electron/"$APP"-"$PLATFORM"-arm64/$APP.app"
X64_PATH="dist/electron/"$APP"-"$PLATFORM"-x64/$APP.app"
UNV_PATH="dist/electron/"$APP"-"$PLATFORM"-universal/$APP.app"

ensureEnv "APPLE_DISTRIBUTION_KEY" "\"Apple Development: Company Name (XXXXXXXXXX)\""

echo "\x1b[32m  Runing \x1b[36m DEBUG=* yarn electron-osx-sign --identity="$APPLE_DISTRIBUTION_KEY" $ARM_PATH\x1b[0m"
sleep 1
DEBUG=* yarn electron-osx-sign --identity="$APPLE_DISTRIBUTION_KEY" $ARM_PATH

echo "\x1b[32m  Runing \x1b[36m DEBUG=* yarn electron-osx-sign --identity="$APPLE_DISTRIBUTION_KEY" $X64_PATH\x1b[0m"
sleep 1
DEBUG=* yarn electron-osx-sign --identity="$APPLE_DISTRIBUTION_KEY" $X64_PATH

echo "\x1b[32m  Runing \x1b[36m DEBUG=* yarn electron-osx-sign --identity="$APPLE_DISTRIBUTION_KEY" $UNV_PATH\x1b[0m"
sleep 1
DEBUG=* yarn electron-osx-sign --identity="$APPLE_DISTRIBUTION_KEY" $UNV_PATH

sleep 1
echo "Done"
