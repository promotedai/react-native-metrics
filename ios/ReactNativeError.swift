import Foundation
import PromotedAIMetricsSDK

enum ReactNativeError: Error {
  case moduleNotInitialized
}

#if DEBUG
extension ReactNativeError: ErrorDetails {
  var details: String {
    switch self {
    case .moduleNotInitialized:
      return """
      PromotedMetricsModule was not initialized correctly. This may be due to a recent change to AppDelegate. Make sure that PromotedMetricsModule is included in -extraModulesForBridge:.
      """
    }
  }
}
#endif
