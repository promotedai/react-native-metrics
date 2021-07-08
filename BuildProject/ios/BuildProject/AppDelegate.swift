import Foundation
import PromotedAIMetricsSDK
import React
import react_native_metrics
import UIKit

@main
class AppDelegate: NSObject, UIApplicationDelegate, RCTBridgeDelegate {

  var window: UIWindow?

  func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    guard let bridge = RCTBridge(delegate: self, launchOptions: launchOptions) else { return false }
    let rootView = RCTRootView(bridge: bridge, moduleName: "BuildProject", initialProperties: nil)
    if #available(iOS 13.0, *) {
      rootView.backgroundColor = UIColor.systemBackground
    } else {
      rootView.backgroundColor = UIColor.white
    }
    let window = UIWindow(frame: UIScreen.main.bounds)
    let rootViewController = UIViewController()
    rootViewController.view = rootView
    window.rootViewController = rootViewController
    window.makeKeyAndVisible()
    self.window = window
    return true
  }

  func sourceURL(for bridge: RCTBridge!) -> URL! {
    #if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index", fallbackResource: nil)
    #else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    #endif
  }

  func extraModules(for bridge: RCTBridge!) -> [RCTBridgeModule]! {
    var config = ClientConfig()
    config.metricsLoggingURL = "http://fake.promoted.ai/metrics"
    config.metricsLoggingAPIKey = "apikey!"
    do {
      let service = try MetricsLoggerService(initialConfig: config)
      try service.startLoggingServices()
      let module = PromotedMetricsModule(metricsLoggerService: service)
      return ([module] as! [RCTBridgeModule])
    } catch {
      print(error.localizedDescription)
      return []
    }
  }
}
