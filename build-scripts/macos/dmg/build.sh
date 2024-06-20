#!/bin/sh
# Build .dmg targets for arm64 and x86_64
# shellcheck source=../../common/set-env.sh
. "$(realpath "$0/../../../common/set-env.sh")"

echo "Preparing build for macos .dmg target..."
if [ -z "$BUILD_PLATFORM" ]; then
  echo "If you want to build the mas(Mac App Store) package, you need to add BUILD_PLATFORM=mas before you build apps."
  BUILD_PLATFORM="darwin"
else
  echo "Build platform: $BUILD_PLATFORM"
fi

# Go to root directory
echo "Current working directory: $(dirname "$(realpath "$0/../../..")")"
cd "$(dirname "$(realpath "$0/../../..")")"

sleep 1

echo "Making dmg..."
sleep 1

ensureExists "dist/electron/$APP-$BUILD_PLATFORM-x64/$APP.app"
printf "\x1b[32m  Runing \x1b[36m BUILD_ARCH=x64 BUILD_PLATFORM=%1 yarn make \x1b[32m This may take minutes\x1b[0m\n" "$BUILD_PLATFORM"
BUILD_ARCH=x64 BUILD_PLATFORM=$BUILD_PLATFORM yarn make
echo "Successfully make x64 dmg"
sleep 1

ensureExists "dist/electron/$APP-$BUILD_PLATFORM-arm64/$APP.app"
printf "\x1b[32m  Runing \x1b[36m BUILD_ARCH=arm64 BUILD_PLATFORM=%1 yarn make \x1b[32m This may take minutes\x1b[0m\n" "$BUILD_PLATFORM"
BUILD_ARCH=arm64 BUILD_PLATFORM=$BUILD_PLATFORM yarn make
echo "Successfully make arm64 dmg"
sleep 1

ensureExists "dist/electron/$APP-$BUILD_PLATFORM-universal/$APP.app"
printf "\x1b[32m  Runing \x1b[36m BUILD_ARCH=universal BUILD_PLATFORM=%1 yarn make \x1b[32m This may take minutes\x1b[0m\n" "$BUILD_PLATFORM"
BUILD_ARCH=universal BUILD_PLATFORM=$BUILD_PLATFORM yarn make
echo "Successfully make universal dmg"
sleep 1

echo "Done."
echo ""
