#!/bin/zsh

echo "$0: Removing existing build dir\n"
rm -rf build

echo "$0: Creating build dir\n"
mkdir -p build/Payload

echo "$0: Building archive\n"
xcodebuild -workspace ios/BuildProject.xcworkspace -scheme BuildProject -archivePath build/ReactNativeMetricsBuildProject archive -sdk iphonesimulator -destination 'platform=iOS Simulator,name=iPhone 11'

echo "$0: Copy archive to build/Payload\n"
cp -R build/ReactNativeMetricsBuildProject.xcarchive/Products/Applications/BuildProject.app build/Payload

echo "$0: Creating IPA\n"
zip -r -X build/BuildProject.ipa build/Payload

echo "$0: Success\n"
