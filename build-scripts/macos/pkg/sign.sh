#!/bin/sh
# Sign .app for releasing
# shellcheck source=../../common/set-env.sh
. "build-scripts/common/set-env.sh"


ensureEnv "APP" "your app name"
ensureEnv "VERSION" "x.x.x"
# Maybe enable other targets in the future
ensureEnv "PLATFORM" "\"mas\""
ensureEnv "APPLE_TEAM_ID" "org.your-org.app-name"

# ARM_PATH="out/$APP-$PLATFORM-arm64/$APP.app"
# X64_PATH="out/$APP-$PLATFORM-x64/$APP.app"
ensureEnv "BUILD_ARCH"
UNV_PATH="out/$APP-$PLATFORM-$BUILD_ARCH/$APP.app"
# if $IS_DEV; then
#   echo "DEV $IS_DEV"
#   DEBUG="electron-osx-sign"
# else
#   DEBUG=""
# fi

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

TEAM_ID="$APPLE_TEAM_ID" node "build-scripts/macos/app/buildEntitlements.js" "$ENTITLEMENTS_DIR" --pkg

# ENTITLEMENT="$ENTITLEMENTS_DIR/entitlements.mas.plist"
ENTITLEMENT="build-scripts/macos/pkg/entitlements.plist"
INHERIT="$ENTITLEMENTS_DIR/entitlements.inherit.plist"
LOGINHELPER="$ENTITLEMENTS_DIR/entitlements.loginhelper.plist"

cat "$ENTITLEMENT"
echo ""

echo "Start signing"
echo ""

find "$UNV_PATH" -name "* Framework" -exec codesign -s "$APPLE_DISTRIBUTION_KEY" --timestamp -f --options runtime --entitlements "$INHERIT" "{}" \;
find "$UNV_PATH" -name "*.dylib" -exec codesign -s "$APPLE_DISTRIBUTION_KEY" --timestamp -f --entitlements "$INHERIT" "{}" \;
find "$UNV_PATH" -name "*.framework" -exec codesign -s "$APPLE_DISTRIBUTION_KEY" --timestamp -f --options runtime --entitlements "$INHERIT" "{}" \;
find "$UNV_PATH" -name "*.node" -exec codesign -s "$APPLE_DISTRIBUTION_KEY" --timestamp -f --entitlements "$INHERIT" "{}" \;
echo "Signed frameworks"

# codesign -s "$APPLE_DISTRIBUTION_KEY" --timestamp -f --options runtime --entitlements "$INHERIT" "$UNV_PATH/Contents/Frameworks/$APP Helper.app/Contents/MacOS/$APP Helper"
# codesign -s "$APPLE_DISTRIBUTION_KEY" --timestamp -f --options runtime --entitlements "$INHERIT" "$UNV_PATH/Contents/Frameworks/$APP Helper.app/"
# codesign -s "$APPLE_DISTRIBUTION_KEY" --timestamp -f --options runtime --entitlements "$INHERIT" "$UNV_PATH/Contents/Frameworks/$APP Helper (Renderer).app/Contents/MacOS/$APP Helper (Renderer)"
# codesign -s "$APPLE_DISTRIBUTION_KEY" --timestamp -f --options runtime --entitlements "$INHERIT" "$UNV_PATH/Contents/Frameworks/$APP Helper (Renderer).app/"
# codesign -s "$APPLE_DISTRIBUTION_KEY" --timestamp -f --options runtime --entitlements "$INHERIT" "$UNV_PATH/Contents/Frameworks/$APP Helper (GPU).app/Contents/MacOS/$APP Helper (GPU)"
# codesign -s "$APPLE_DISTRIBUTION_KEY" --timestamp -f --options runtime --entitlements "$INHERIT" "$UNV_PATH/Contents/Frameworks/$APP Helper (GPU).app/"
# codesign -s "$APPLE_DISTRIBUTION_KEY" --timestamp -f --options runtime --entitlements "$INHERIT" "$UNV_PATH/Contents/Frameworks/$APP Helper (Plugin).app/Contents/MacOS/$APP Helper (Plugin)"
# codesign -s "$APPLE_DISTRIBUTION_KEY" --timestamp -f --options runtime --entitlements "$INHERIT" "$UNV_PATH/Contents/Frameworks/$APP Helper (Plugin).app/"
if [ -e "$UNV_PATH/Contents/Library" ]; then
  codesign -s "$APPLE_DISTRIBUTION_KEY" --timestamp -f --options runtime --entitlements "$LOGINHELPER" "$UNV_PATH/Contents/Library/LoginItems/$APP Login Helper.app/Contents/MacOS/$APP Login Helper"
  codesign -s "$APPLE_DISTRIBUTION_KEY" --timestamp -f --options runtime --entitlements "$LOGINHELPER" "$UNV_PATH/Contents/Library/LoginItems/$APP Login Helper.app"
fi
if [ -e "$UNV_PATH/Contents/Frameworks/Squirrel.framework/Versions/A/Resources/ShipIt" ]; then
  # This is only available in non-mas build
  codesign -s "$APPLE_DISTRIBUTION_KEY" --timestamp -f --options runtime --entitlements "$INHERIT" "$UNV_PATH/Contents/Frameworks/Squirrel.framework/Versions/A/Resources/ShipIt"
fi
# if [ -e "$UNV_PATH/Contents/Frameworks/Squirrel.framework/Versions/A/Squirrel" ]; then
#   codesign -s "$APPLE_DISTRIBUTION_KEY" --timestamp -f --options runtime --entitlements "$INHERIT" "$UNV_PATH/Contents/Frameworks/Squirrel.framework/Versions/A/Squirrel"
# fi

echo "Sign .app"
echo ""
# # find -f "$UNV_PATH" -exec sh -c codesign -s "$APPLE_DISTRIBUTION_KEY" --timestamp --entitlements "$INHERIT" -f --deep "$UNV_PATH" \;
# codesign -s "$APPLE_DISTRIBUTION_KEY" --timestamp --options runtime --entitlements "$ENTITLEMENT" -f "$UNV_PATH/Contents/MacOS/$APP"
codesign -s "$APPLE_DISTRIBUTION_KEY" --deep --timestamp --options runtime --entitlements "$ENTITLEMENT" -f "$UNV_PATH"

sleep 1
printf "Done\n"
