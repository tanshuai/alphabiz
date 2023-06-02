#!/bin/sh
# shellcheck source=../../common/set-env.sh
# Sign .app for normal release
# This script will sign darwin app for non-store builds.
# Note that different from the `sign.sh` in macos/app which signs MAS build,
# this script will sign app with hardened runtime which is required by apple
# notarization service.
# The app signed by this script is invalid for MAS submission.

. "build-scripts/common/set-env.sh"

ensureEnv "APP" "your app name"
ensureEnv "VERSION" "x.x.x"
# Maybe enable other targets in the future
ensureEnv "PLATFORM" "\"mas\""
ensureEnv "APPLE_TEAM_ID" "org.your-org.app-name"

ensureEnv "BUILD_ARCH"
APP_PATH="dist/electron/$APP-$PLATFORM-$BUILD_ARCH/$APP.app"

ensureEnv "APPLE_DISTRIBUTION_KEY" "\"Developer ID Distribution: Company Name (XXXXXXXXXX)\""

if [ -e "developer/embedded.provisionprofile" ]; then
  cp "developer/embedded.provisionprofile" "$APP_PATH/Contents/"
  echo "Added embedded provisoning profile"
else
  echo "Warn: Cannot find embedded.provisionprofile in developer folder. This may cause error if you submit signed app to MAS"
fi

if test -d "$TMPDIR"; then
    :
elif test -d "$TMP"; then
    TMPDIR=$TMP
elif test -d /var/tmp; then
    TMPDIR=/var/tmp
else
    TMPDIR=/tmp
fi
ENTITLEMENTS_DIR="$TMPDIR/electron-build-mas/entitlements"
mkdir -p "$ENTITLEMENTS_DIR"

TEAM_ID="$APPLE_TEAM_ID" node "build-scripts/macos/app/buildEntitlements.js" "$ENTITLEMENTS_DIR" --pkg

# ENTITLEMENT="$ENTITLEMENTS_DIR/entitlements.mas.plist"
ENTITLEMENT="build-scripts/macos/pkg/entitlements.plist"
INHERIT="$ENTITLEMENTS_DIR/entitlements.inherit.plist"
LOGINHELPER="$ENTITLEMENTS_DIR/entitlements.loginhelper.plist"

cat "$ENTITLEMENT"
echo ""

echo "Start signing..."

# The binary files should be added first
find "$APP_PATH" -name "* Framework" -exec codesign -s "$APPLE_DISTRIBUTION_KEY" --timestamp -f --options runtime --entitlements "$INHERIT" "{}" \;
find "$APP_PATH" -name "*.dylib" -exec codesign -s "$APPLE_DISTRIBUTION_KEY" --timestamp -f --entitlements "$INHERIT" "{}" \;
find "$APP_PATH" -name "*.framework" -exec codesign -s "$APPLE_DISTRIBUTION_KEY" --timestamp -f --options runtime --entitlements "$INHERIT" "{}" \;
find "$APP_PATH" -name "*.node" -exec codesign -s "$APPLE_DISTRIBUTION_KEY" --timestamp -f --entitlements "$INHERIT" "{}" \;

if [ -e "$APP_PATH/Contents/Library" ]; then
  # This is only available in mas build
  codesign -s "$APPLE_DISTRIBUTION_KEY" --timestamp -f --options runtime --entitlements "$LOGINHELPER" "$APP_PATH/Contents/Library/LoginItems/$APP Login Helper.app/Contents/MacOS/$APP Login Helper"
  codesign -s "$APPLE_DISTRIBUTION_KEY" --timestamp -f --options runtime --entitlements "$LOGINHELPER" "$APP_PATH/Contents/Library/LoginItems/$APP Login Helper.app"
fi

# The ShipIt binary file in Squirrel framework requires signing directly
if [ -e "$APP_PATH/Contents/Frameworks/Squirrel.framework/Versions/A/Resources/ShipIt" ]; then
  # This is only available in non-mas build
  codesign -s "$APPLE_DISTRIBUTION_KEY" --timestamp -f --options runtime --entitlements "$INHERIT" "$APP_PATH/Contents/Frameworks/Squirrel.framework/Versions/A/Resources/ShipIt"
fi

codesign -s "$APPLE_DISTRIBUTION_KEY" --timestamp --options runtime --entitlements "$ENTITLEMENT" -f "$APP_PATH/Contents/MacOS/$APP"
# Use --deep for signing all other files
codesign -s "$APPLE_DISTRIBUTION_KEY" --deep --timestamp --options runtime --entitlements "$ENTITLEMENT" -f "$APP_PATH"

sleep 1
echo "Finish signing $APP_PATH"
