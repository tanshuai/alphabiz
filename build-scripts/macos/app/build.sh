#!/bin/sh
# Build .app targets for arm64 and x86_64

# shellcheck source=../../common/set-env.sh
. "$(realpath "$0/../../../common/set-env.sh")"

echo "Preparing build for macos .app target..."
echo "App: $APP"
echo "Version: $BUILD_VERSION"
if [ -z "$BUILD_PLATFORM" ]; then
  printf "If you want to build the mas(Mac App Store) package, you need to add BUILD_PLATFORM=mas before you build apps."
  BUILD_PLATFORM="darwin"
else
  printf "Build platform: %s" "$BUILD_PLATFORM"
fi

# Go to root directory
echo "Current working directory: $(dirname "$(realpath "$0/../../..")")"
cd "$(dirname "$(realpath "$0/../../..")")"

sleep 1

echo "Clearing dist files before build..."
# We will move built files to dist/ so remove old files first
# rm -r dist/*-x64
mkdir -p dist
find "dist" -type d -name "$APP-$BUILD_PLATFORM-x64" -maxdepth 1 -exec rm -r "{}" \;
# rm -r dist/*-arm64
find "dist" -type d -name "$APP-$BUILD_PLATFORM-arm64" -maxdepth 1 -exec rm -r "{}" \;
sleep 1

echo "Building x64 target..."
printf "\x1b[32m  Runing \x1b[36m arch -x86_64 -e BUILD_ARCH=x64 yarn build \x1b[32m This may take minutes\x1b[0m\n"
if $IS_DEV; then
  arch -x86_64 -e BUILD_ARCH=x64 -e BUILD_PLATFORM="$BUILD_PLATFORM" -e BUILD_VERSION="$BUILD_VERSION" yarn build;
else
  arch -x86_64 -e BUILD_ARCH=x64 -e BUILD_PLATFORM="$BUILD_PLATFORM" -e BUILD_VERSION="$BUILD_VERSION" yarn build 1>>./build.log 2>>./build.log;
fi
# cp -R "dist/electron/*-x64" "dist/"
echo "Successfully building x64 target"
find "dist/electron" -type d -name "$APP-$BUILD_PLATFORM-x64" -maxdepth 1 -exec cp -a "{}" "dist" \;
echo "Copied x64 build to dist/"
sleep 1

echo "Buiding arm64 target.."
printf "\x1b[32m  Runing \x1b[36m arch -arm64 -e BUILD_ARCH=arm64 yarn build \x1b[32m This may take minutes\x1b[0m\n"
if $IS_DEV; then
  arch -arm64 -e BUILD_ARCH=arm64 -e BUILD_PLATFORM="$BUILD_PLATFORM" -e BUILD_VERSION="$BUILD_VERSION" yarn build;
else
  arch -arm64 -e BUILD_ARCH=arm64 -e BUILD_PLATFORM="$BUILD_PLATFORM" -e BUILD_VERSION="$BUILD_VERSION" yarn build 1>>./build.log 2>>./build.log;
fi
# The `cp` command will throw errors here like
# cp: dist/electron/*-x64: No such file or directory
# cp -R dist/electron/*-arm64 "dist/"
echo "Successfully building arm64 target"
find "dist/electron" -type d -name "$APP-$BUILD_PLATFORM-arm64" -maxdepth 1 -exec cp -a "{}" "dist" \;
echo "Copied arm64 build to dist/"
sleep 1

echo "Building universal app..."
find "dist/electron" -type d -name "$APP-$BUILD_PLATFORM-arm64" -maxdepth 1 -exec rm -r "{}" \;
find "dist" -type d -name "$APP-$BUILD_PLATFORM-x64" -maxdepth 1 -exec cp -a "{}" "dist/electron/" \;
find "dist" -type d -name "$APP-$BUILD_PLATFORM-arm64" -maxdepth 1 -exec cp -a "{}" "dist/electron/" \;
printf "\x1b[32m  Runing \x1b[36mBUILD_PLATFORM=%s node build-scripts/common/make --make-universal\x1b[32m This may take minutes\x1b[0m\n" "$BUILD_PLATFORM"
sleep 1
BUILD_PLATFORM=$BUILD_PLATFORM node build-scripts/common/make --make-universal
