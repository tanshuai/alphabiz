#!/bin/bash
# Build .pkg file for universal .app target
# This script will first sign the app with "Apple Distribution" certificate,
# and then pack it to a .pkg file with "3rd Party Mac Developer Installer"
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
if [ "$PLATFORM" = "mas" ]; then
  echo "Building mas pkg..."
  ARCH="universal"
  APP_PATH="dist/electron/$APP-$PLATFORM-$ARCH/$APP.app"
  # ensureExists "$APP_PATH"
  if [ ! -e "$APP_PATH" ]; then
    echo "Cannot find build app. Running build script..."
    infiniteRetry build-scripts/macos/app/build.sh
  else
    echo "Found app build."
  fi
  if [ ! -e "$APP_PATH/Contents/_CodeSignature" ]; then
    echo "Build app is not signed. Running sign script..."
    . build-scripts/macos/app/sign.sh
  else
    echo "Found app signed."
  fi
  RESULT_PATH="out/installers/$VERSION/$APP_$PLATFORM_$VERSION.pkg"

  ensureEnv "APPLE_DISTRIBUTION_KEY" "\"Apple Distribution: Company Name (XXXXXXXXXX)\""
  ensureEnv "APPLE_INSTALLER_KEY" "\"3rd Party Mac Developer Installer: (XXXXXXXXXX)\""

  mkdir -p "$(dirname "$RESULT_PATH")"
  productbuild --component "$APP_PATH" /Applications --sign "$APPLE_INSTALLER_KEY" "$RESULT_PATH"

  if [[ -n "$APPLE_ID" ]] && [[ -n "$APPLE_ASP" ]]; then
    echo "Validate pkg with your apple id..."
    sleep 1
    xcrun altool --validate-app -f "$RESULT_PATH" -t osx -u "$APPLE_ID" -p "$APPLE_ASP"
  else
    printf "You can validate your package via \x1b[32mxcrun altool --validate-app -f \"%s\" -t osx -u YOUR_APPLE_ID -p YOUR_APP_SPEC_PASS\x1b[0m" "$RESULT_PATH"
  fi
else
  echo "Building non-mas pkg..."
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
fi
