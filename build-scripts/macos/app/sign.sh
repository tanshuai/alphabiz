#!/bin/sh
# shellcheck source=../../common/set-env.sh
# Sign .app for MAS build
# This script will sign the MAS build app for Mac App Store. Usually you don't
# need to run this by your self. The `build-scripts/macos/pkg/build.sh` will run
# this if you set $PLATFORM to "mas".
# The app signed by this script cannot be notarized and will crash if is not
# installed from MAS.

. "$(realpath "$0/../../../common/set-env.sh")"

# Go to root directory
echo "Current working directory: $(dirname "$(realpath "$0/../../..")")"
cd "$(dirname "$(realpath "$0/../../..")")"

ensureEnv "APP" "your app name"
ensureEnv "VERSION" "x.x.x"
# Maybe enable other targets in the future
ensureEnv "PLATFORM" "\"mas\""

UNV_PATH="dist/electron/$APP-$PLATFORM-universal/$APP.app"

ensureEnv "APPLE_DISTRIBUTION_KEY" "\"Apple Development: Company Name (XXXXXXXXXX)\""

if [ -e "developer/embedded.provisionprofile" ]; then
  cp "developer/embedded.provisionprofile" "$UNV_PATH/Contents/"
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

TEAM_ID="$APPLE_TEAM_ID" node "build-scripts/macos/app/buildEntitlements.js" "$ENTITLEMENTS_DIR"

ENTITLEMENT="$ENTITLEMENTS_DIR/entitlements.mas.plist"
INHERIT="$ENTITLEMENTS_DIR/entitlements.inherit.plist"
LOGINHELPER="$ENTITLEMENTS_DIR/entitlements.loginhelper.plist"

cat "$ENTITLEMENT"
echo ""

find "$UNV_PATH" -name "*.dylib" -exec codesign -s "$APPLE_DISTRIBUTION_KEY" -f --entitlements "$INHERIT" "{}" \;
find "$UNV_PATH" -name "*.framework" -exec codesign -s "$APPLE_DISTRIBUTION_KEY" -f --entitlements "$INHERIT" "{}" \;
find "$UNV_PATH" -name "*.node" -exec codesign -s "$APPLE_DISTRIBUTION_KEY" -f --entitlements "$INHERIT" "{}" \;
find "$UNV_PATH" -name "* Framework" -exec codesign -s "$APPLE_DISTRIBUTION_KEY" -f --entitlements "$INHERIT" "{}" \;

codesign -s "$APPLE_DISTRIBUTION_KEY" -f --entitlements "$INHERIT" "$UNV_PATH/Contents/Frameworks/$APP Helper.app/Contents/MacOS/$APP Helper"
codesign -s "$APPLE_DISTRIBUTION_KEY" -f --entitlements "$INHERIT" "$UNV_PATH/Contents/Frameworks/$APP Helper.app/"
codesign -s "$APPLE_DISTRIBUTION_KEY" -f --entitlements "$INHERIT" "$UNV_PATH/Contents/Frameworks/$APP Helper (Renderer).app/Contents/MacOS/$APP Helper (Renderer)"
codesign -s "$APPLE_DISTRIBUTION_KEY" -f --entitlements "$INHERIT" "$UNV_PATH/Contents/Frameworks/$APP Helper (Renderer).app/"
codesign -s "$APPLE_DISTRIBUTION_KEY" -f --entitlements "$INHERIT" "$UNV_PATH/Contents/Frameworks/$APP Helper (GPU).app/Contents/MacOS/$APP Helper (GPU)"
codesign -s "$APPLE_DISTRIBUTION_KEY" -f --entitlements "$INHERIT" "$UNV_PATH/Contents/Frameworks/$APP Helper (GPU).app/"
codesign -s "$APPLE_DISTRIBUTION_KEY" -f --entitlements "$INHERIT" "$UNV_PATH/Contents/Frameworks/$APP Helper (Plugin).app/Contents/MacOS/$APP Helper (Plugin)"
codesign -s "$APPLE_DISTRIBUTION_KEY" -f --entitlements "$INHERIT" "$UNV_PATH/Contents/Frameworks/$APP Helper (Plugin).app/"
codesign -s "$APPLE_DISTRIBUTION_KEY" -f --entitlements "$LOGINHELPER" "$UNV_PATH/Contents/Library/LoginItems/$APP Login Helper.app/Contents/MacOS/$APP Login Helper"
codesign -s "$APPLE_DISTRIBUTION_KEY" -f --entitlements "$LOGINHELPER" "$UNV_PATH/Contents/Library/LoginItems/$APP Login Helper.app"

# find -f "$UNV_PATH" -exec sh -c codesign -s "$APPLE_DISTRIBUTION_KEY" --entitlements "$INHERIT" -f --deep "$UNV_PATH" \;
codesign -s "$APPLE_DISTRIBUTION_KEY" --entitlements "$ENTITLEMENT" -f "$UNV_PATH"

sleep 1
printf "Done\n"
