#!/bin/sh
# Build command for macOS
# This script will build three macOS apps(arm64, x64 and universal) one by one
set -e
echo "Preparing build for macos..."

# Go to root directory
echo "Current working directory: $(dirname "$(realpath "$0/..")")"
cd "$(dirname "$(realpath "$0/..")")"

IS_DEV=false
if [[ $1 = "--dev" ]]; then
  echo "dev"
  IS_DEV=true
  echo "Run in development mode."
  echo "Build logs will print to screen."
else
  echo "Run in production mode. "
  find "." -type f -name "mac-build.log" -maxdepth 1 -exec rm -r "{}" \;
  echo "Build logs redirected to $(dirname "$(realpath "$0/..")")/mac-build.log"
fi

sleep 1

echo "Clearing build files before build..."
# We will move built files to build/ so remove old files first
# rm -r build/*-x64
mkdir -p build
find "build" -type d -name "*-x64" -maxdepth 1 -exec rm -r "{}" \;
# rm -r build/*-arm64
find "build" -type d -name "*-arm64" -maxdepth 1 -exec rm -r "{}" \;
sleep 1

echo "\nBuilding x64 target..."
echo "\x1b[32m  Runing \x1b[36m arch -x86_64 -e BUILD_ARCH=x64 yarn packager \x1b[32m This may take minutes\x1b[0m"
if $IS_DEV; then
  arch -x86_64 -e BUILD_ARCH=x64 yarn packager;
else
  arch -x86_64 -e BUILD_ARCH=x64 yarn packager 1>>./mac-build.log 2>>./mac-build.log;
fi
# cp -R "build/electron/*-x64" "build/"
echo "Successfully building x64 target"
find "build/electron" -type d -name "*-x64" -maxdepth 1 -exec cp -a "{}" "build" \;
echo "Copied x64 build to build/"
sleep 1

echo "\nBuiding arm64 target.."
echo "\x1b[32m  Runing \x1b[36m arch -arm64 -e BUILD_ARCH=arm64 yarn packager \x1b[32m This may take minutes\x1b[0m"
if $IS_DEV; then
  BUILD_ARCH=arm64 yarn packager;
else
  BUILD_ARCH=arm64 yarn packager 1>>./mac-build.log 2>>./mac-build.log;
fi
# The `cp` command will throw errors here like
# cp: build/electron/*-x64: No such file or directory
# cp -R build/electron/*-arm64 "build/"
echo "Successfully building arm64 target"
find "build/electron" -type d -name "*-arm64" -maxdepth 1 -exec cp -a "{}" "build" \;
echo "Copied arm64 build to build/"
sleep 1

echo "check package"
ls build/
echo '---------------------------'
ls build/electron/

echo "\nBuilding universal app..."
find "build/electron" -type d -name "*-x64" -maxdepth 1 -exec rm -r "{}" \;
find "build/electron" -type d -name "*-arm64" -maxdepth 1 -exec rm -r "{}" \;
find "build" -type d -name "*-x64" -maxdepth 1 -exec cp -a "{}" "build/electron/" \;
find "build" -type d -name "*-arm64" -maxdepth 1 -exec cp -a "{}" "build/electron/" \;
echo "\x1b[32m  Runing \x1b[36m node make --make-universal \x1b[32m This may take minutes\x1b[0m"
sleep 1
node make --make-universal

echo "\n\nMaking dmg..."
sleep 1
echo "\x1b[32m  Runing \x1b[36m BUILD_ARCH=x64 yarn make \x1b[32m This may take minutes\x1b[0m"
BUILD_ARCH=x64 yarn make
echo "Successfully make x64 dmg"
echo "\x1b[32m  Runing \x1b[36m BUILD_ARCH=arm64 yarn make \x1b[32m This may take minutes\x1b[0m"
BUILD_ARCH=arm64 yarn make
echo "Successfully make arm64 dmg"
echo "\x1b[32m  Runing \x1b[36m BUILD_ARCH=universal yarn make \x1b[32m This may take minutes\x1b[0m"
BUILD_ARCH=universal yarn make
echo "Successfully make universal dmg"

echo "\n\nDone.\n"
