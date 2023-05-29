#!/bin/bash
# Build .pkg file and sign with developer certs
# This script will first sign the app with "Developer ID Distribution" certificate,
# and then pack it to a .pkg file with "Developer ID Installer"
# shellcheck source=../../common/set-env.sh
. "build-scripts/common/set-env.sh"
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
# ARCH="arm64"
ensureEnv "BUILD_ARCH"
ARCH=$BUILD_ARCH

APP_PATH="out/$APP-$PLATFORM-$ARCH/$APP.app"
ensureExists "$APP_PATH"
if [ ! -e "$APP_PATH/Contents/_CodeSignature" ]; then
  echo "Build app is not signed. Running sign script..."
  . build-scripts/macos/pkg/sign.sh
else
  echo "Found app signed."
fi
RESULT_PATH="out/installers/$VERSION/""$APP""_""$PLATFORM""_""$VERSION""_unsigned.pkg"
SIGNED_PATH="out/installers/$VERSION/""$APP""_""$PLATFORM""_""$VERSION"".pkg"

ensureEnv "APPLE_INSTALLER_KEY" "\"Developer ID Installer: (XXXXXXXXXX)\""

echo "$RESULT_PATH" "$APP" "$PLATFORM"
mkdir -p "$(dirname "$RESULT_PATH")"
# echo "productbuild --component" "$APP_PATH" "/Applications" --sign "$APPLE_INSTALLER_KEY" "$RESULT_PATH"
echo "Creating package..."
productbuild --component "$APP_PATH" /Applications "$RESULT_PATH" # --sign "$APPLE_INSTALLER_KEY"
echo "Created unsigned pkg $RESULT_PATH"
productsign --sign "$APPLE_INSTALLER_KEY" "$RESULT_PATH" "$SIGNED_PATH"
echo "Created signed pkg $SIGNED_PATH"

echo "Notarizing..."
# xcrun altool --notarize-app --primary-bundle-id "$APP_BUNDLE_ID" --username="$APPLE_ID" --password "$APPLE_ASP" --file "$SIGNED_PATH"
xcrun notarytool submit "$SIGNED_PATH" -v --apple-id "$APPLE_ID" --password "$APPLE_ASP" --team-id "$APPLE_TEAM_ID" -f json --wait
echo "Notarized."
xcrun stapler staple "$SIGNED_PATH"
echo "Stapled"
echo "Finish signing pkg file."
