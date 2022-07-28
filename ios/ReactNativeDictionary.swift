import Foundation
import PromotedAIMetricsSDK

/// Dictionary objects that represent content as expected from React Native.
public typealias ReactNativeDictionary = [String: Any]

extension ReactNativeDictionary {
  func valueForCalledPropertyNameAsKey<T>(
    function: String = #function
  ) -> T? {
    return self[function] as? T
  }

  var actionName: String? { valueForCalledPropertyNameAsKey() }

  var actionType: ActionType {
    ActionType(rawValue: (self["actionType"] as? Int) ?? 0) ?? .unknown
  }

  var autoViewID: String? { self["autoViewId"] as? String }

  var autoViewState: AutoViewState {
    AutoViewState(
      autoViewID: self.autoViewID,
      hasSuperimposedViews: self.hasSuperimposedViews
    )
  }

  var cart: Cart? { Cart(valueForCalledPropertyNameAsKey()) }

  var collectionID: String? { self["collectionId"] as? String }

  var collectionInteraction: CollectionInteraction? {
    guard let indexPath = self["indexPath"] as? [Int] else {
      return nil
    }
    return CollectionInteraction(indexPath: indexPath)
  }

  var collectionInteractionArray: [CollectionInteraction]? {
    guard let indexPaths = self["indexPaths"] as? [[Int]] else {
      return nil
    }
    return indexPaths.map { CollectionInteraction(indexPath: $0) }
  }

  var content: Content? { Content(valueForCalledPropertyNameAsKey()) }

  var destinationScreenName: String? { valueForCalledPropertyNameAsKey() }

  var hasSuperimposedViews: Bool {
    guard
      let value: Int? = valueForCalledPropertyNameAsKey()
    else { return false }
    return (value != 0)
  }

  var impressionSourceType: ImpressionSourceType {
    ImpressionSourceType(
      rawValue: (self["sourceType"] as? Int) ?? 0
    ) ?? .unknown
  }

  var routeName: String? { valueForCalledPropertyNameAsKey() }

  var routeKey: String? { valueForCalledPropertyNameAsKey() }

  var visibleContentArray: [Content] {
    (self["visibleContent"] as? [ReactNativeDictionary] ?? [])
      .compactMap { Content($0) }
  }
}
