#!/bin/zsh

rm node_modules/@promotedai/react-native-metrics
mkdir -p node_modules/@promotedai/react-native-metrics
cp -R ../ios node_modules/@promotedai/react-native-metrics
cp -R ../lib node_modules/@promotedai/react-native-metrics
cp -R ../src node_modules/@promotedai/react-native-metrics
cp ../package.json node_modules/@promotedai/react-native-metrics
echo "$0: Overwrite package @promotedai/react-native-metrics with local copy.\n"

