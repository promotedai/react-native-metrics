#!/bin/zsh
set -e

build_ios_app() {
  echo "$0: [iOS] Building archive\n"
  xcodebuild -workspace ios/BuildProject.xcworkspace -scheme BuildProject -archivePath build/ReactNativeMetricsBuildProject archive -sdk iphonesimulator -destination 'platform=iOS Simulator,name=iPhone 14 Pro Max' -allowProvisioningUpdates

  echo "$0: [iOS] Copy archive to build/Payload dir\n"
  cp -R build/ReactNativeMetricsBuildProject.xcarchive/Products/Applications/BuildProject.app build/Payload

  echo "$0: [iOS] Creating IPA\n"
  zip -r -X build/BuildProject.ipa build/Payload
}

build_android_app() {
  echo "$0: [Android] Creating assets and res dirs\n"
  mkdir -p android/app/src/main/assets
  mkdir -p android/app/src/main/res

  echo "$0: [Android] Bundling app\n"
  react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

  echo "$0: [Android] Removing duplicate dirs\n"
  rm -rf android/app/src/main/res/drawable-*
  rm -rf android/app/src/main/res/raw

  echo "$0: [Android] Building apk\n"
  cd android
  ./gradlew clean
  ./gradlew assembleRelease

  echo "$0: [Android] Copy apk to build dir\n"
  cd ..
  cp android/app/build/outputs/apk/release/app-release.apk build/
}

echo "$0: Removing existing build dir\n"
rm -rf build

echo "$0: Creating build dir\n"
mkdir -p build/Payload

case "$TEST_PLATFORM" in
("ios")
  build_ios_app
  ;;
("android")
  build_android_app
  ;;
*)
  echo "Unknown TEST_PLATFORM: $TEST_PLATFORM"
  exit 1
  ;;
esac

echo "$0: Success\n"
