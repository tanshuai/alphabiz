#!/bin/bash
# Build .pkg file for universal .app target
# This script will first sign the app with "Apple Distribution" certificate,
# and then pack it to a .pkg file with "3rd Party Mac Developer Installer"
# shellcheck source=../../common/set-env.sh
. "$(realpath "$0/../../../common/set-env.sh")"

# Running a command until success(exit with code 0)
function infiniteRetry () {
  until "$@"
  do
    echo "Retry"
    sleep 1
  done
}

ensureEnv "APP" "your app name"
ensureEnv "VERSION" "x.x.x"
# Maybe enable other targets in the future
ensureEnv "PLATFORM" "\"mas\""
ARCH="universal"

APP_PATH="dist/electron/$APP-$PLATFORM-$ARCH/$APP.app"
if [ ! -e "$APP_PATH" ]; then
  echo "Cannot find build app. Running build script..."
  infiniteRetry build-scripts/macos/app/build.sh
else
  echo "Found app build."
fi
ensureExists "$APP_PATH"
if [ ! -e "$APP_PATH/Contents/_CodeSignature" ]; then
  echo "Build app is not signed. Running sign script..."
  . build-scripts/macos/app/sign.sh
else
  echo "Found app signed."
fi
RESULT_PATH="out/installers/$VERSION/$APP_$PLATFORM_$VERSION.pkg"

ensureEnv "APPLE_DISTRIBUTION_KEY" "\"Apple Distribution: Company Name (XXXXXXXXXX)\""
ensureEnv "APPLE_INSTALLER_KEY" "\"3rd Party Mac Developer Installer: (XXXXXXXXXX)\""

# ensureExists "$APP_PATH/Contents/_CodeSignature" "Signing app before packaging. This require installing @electron/osx-sign."
# sleep 1
# exit 0
# DEBUG=* yarn electron-osx-sign --identity="$APPLE_DISTRIBUTION_KEY" $APP_PATH

mkdir -p "$(dirname "$RESULT_PATH")"
productbuild --component "$APP_PATH" /Applications --sign "$APPLE_INSTALLER_KEY" "$RESULT_PATH"

if [[ -n "$APPLE_ID" ]] && [[ -n "$APPLE_ASP" ]]; then
  echo "Validate pkg with your apple id..."
  sleep 1
  xcrun altool --validate-app -f "$RESULT_PATH" -t osx -u "$APPLE_ID" -p "$APPLE_ASP"
else
  printf "You can validate your package via \x1b[32mxcrun altool --validate-app -f \"%s\" -t osx -u YOUR_APPLE_ID -p YOUR_APP_SPEC_PASS\x1b[0m" "$RESULT_PATH"
fi
