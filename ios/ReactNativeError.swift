import Foundation
import PromotedAIMetricsSDK

enum ReactNativeError: Error {
  case moduleNotInitialized
}

extension ReactNativeError: NSErrorProperties {

  public var code: Int {
    switch self {
    case .moduleNotInitialized:
      return 70001
    }
  }
}

#if DEBUG || PROMOTED_ERROR_HANDLING
extension ReactNativeError: ErrorDetails {
  var details: String {
    switch self {
    case .moduleNotInitialized:
      return """
      PromotedMetricsModule was not initialized correctly. This may be due to a recent change to AppDelegate. Make sure that PromotedMetricsModule is included in -[AppDelegate extraModulesForBridge:].
      """
    }
  }
}
#endif
