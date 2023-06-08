require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-metrics"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "10.0" }
  s.source       = { :git => "https://github.com/promotedai/react-native-metrics.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,swift}"

  s.dependency "React-Core"
  s.dependency "PromotedAIMetricsSDK", "~> 1.3.3"

  # If the app pulls in PromotedAIMetricsSDK/FirebaseAnalytics,
  # then we need to pull this in too. If the app doesn't pull in
  # that dependency, then this is ignored.
  s.xcconfig = { 'USER_HEADER_SEARCH_PATHS' => '"${PODS_ROOT}/Firebase/CoreOnly/Sources"' }
end
