import Foundation
import PromotedAIMetricsSDK

extension Content {

  static let nameKeys = ["name"]
  static let contentIDKeys = ["contentId"]
  static let insertionIDKeys = ["insertionId"]

  convenience init(_ dict: ReactNativeDictionary?) {
    self.init(
      properties: dict,
      nameKeys: Self.nameKeys,
      contentIDKeys: Self.contentIDKeys,
      insertionIDKeys: Self.insertionIDKeys
    )
  }
}
