import Foundation
import PromotedAIMetricsSDK
import os.log

// MARK: -
/**
 `MetricsLogger` methods packaged as a module. Has many of the same methods
 as `MetricsLogger` and `ImpressionTracker`, but delegates those methods to
 instances of those loggers.
 */
@objc(PromotedMetricsModule)
public class PromotedMetricsModule: NSObject {

  /// Dictionary objects that represent content as expected from React Native.
  public typealias ReactNativeDictionary = [String: Any]

  public typealias LogImpressionArgs = ReactNativeDictionary
  public typealias LogActionArgs = ReactNativeDictionary
  public typealias LogViewArgs = ReactNativeDictionary
  public typealias LogAutoViewArgs = ReactNativeDictionary

  private let service: MetricsLoggerService?
  private var metricsLogger: MetricsLogger? { service?.metricsLogger }
  private var idToImpressionTracker: [String: ImpressionTracker]

  @objc public override convenience init() {
    // Log a debug message instead of throwing an error so that clients
    // can integrate the build dependency without adding configuration
    // in the same change.
    let log = OSLog(subsystem: "ai.promoted", category: "PromotedMetricsModule")
    os_log("PromotedMetricsModule not configured", log: log, type: .debug)
    self.init(optionalMetricsLoggerService: nil)
  }

  @objc public convenience init(metricsLoggerService: MetricsLoggerService) {
    self.init(optionalMetricsLoggerService: metricsLoggerService)
  }

  private init(
    optionalMetricsLoggerService: MetricsLoggerService?
  ) {
    self.service = optionalMetricsLoggerService
    self.idToImpressionTracker = [:]
  }

  @objc public var methodQueue: DispatchQueue { DispatchQueue.main }

  @objc public static func requiresMainQueueSetup() -> Bool { true }
}

public extension PromotedMetricsModule {
  // MARK: - Starting new sessions
  @objc(startSessionAndLogUser:)
  func startSessionAndLogUser(userID: String) {
    metricsLogger?.startSessionAndLogUser(userID: userID)
  }

  @objc(startSessionAndLogSignedOutUser)
  func startSessionAndLogSignedOutUser() {
    metricsLogger?.startSessionAndLogSignedOutUser()
  }

  // MARK: - Impressions
  @objc(logImpression:)
  func logImpression(args: LogImpressionArgs?) {
    metricsLogger?.logImpression(
      content: Content(args?.content),
      viewID: args?.autoViewID,
      sourceType: args?.impressionSourceType ?? .unknown
    )
  }

  // MARK: - Actions
  @objc(logAction:)
  func logAction(_ args: LogActionArgs?) {
    metricsLogger?.logAction(
      type: args?.actionType ?? .unknown,
      content: Content(args?.content),
      viewID: args?.autoViewID,
      name: args?.destinationScreenName ?? args?.actionName
    )
  }

  // MARK: - Views
  @objc(logView:)
  func logView(_ args: LogViewArgs?) {
    metricsLogger?.logView(
      routeName: args?.routeName,
      routeKey: args?.routeKey
    )
  }

  @objc(logAutoView:)
  func logAutoView(_ args: LogAutoViewArgs?) {
    print("***** \(#function) \(args)")
    metricsLogger?.logAutoView(
      routeName: args?.routeName,
      routeKey: args?.routeKey,
      viewID: args?.autoViewID
    )
  }
}

// MARK: - CollectionTracker
public extension PromotedMetricsModule {

  /// Begins tracking session for given collection view.
  /// Can be called multiple times in succession, such as when a collection
  /// view reloads on a timer. In these cases, the impression logging state
  /// from the previous session will persist.
  ///
  /// - Parameters:
  ///   - id: Identifier for collection view to track.
  ///   - sourceType: Source of content in collection view.
  @objc(collectionDidMount:sourceType:)
  func collectionDidMount(id: String, sourceType: Int) {
    // A load without a previous unmount can be due to a page refresh.
    // Don't recreate the logger in this case.
    if let _ = idToImpressionTracker[id] { return }
    let s = ImpressionSourceType(rawValue: sourceType) ?? .unknown
    if let tracker = service?.impressionTracker()?.with(sourceType: s) {
      idToImpressionTracker[id] = tracker
    }
  }

  /// Logs impressions for changed content.
  /// Call this method with currently visible content and the underlying
  /// `ImpressionTracker` will calculate deltas and log appropriate events.
  ///
  /// - Parameters:
  ///   - visibleContent: List of currently visible content.
  ///   - id: Identifier for collection view to track.
  @objc(collectionDidChange:collectionID:)
  func collectionDidChange(visibleContent: [AnyObject], id: String) {
    guard let tracker = idToImpressionTracker[id] else { return }
    let contentList = visibleContent.map {
      Content($0 as? ReactNativeDictionary)
    }
    tracker.collectionViewDidChangeVisibleContent(contentList)
  }

  /// Logs actions for content in a given collection view.
  /// Call this method when an action occurs within a tracked collection view.
  ///
  /// - Parameters:
  ///   - actionType: As defined by `ActionType`.
  ///   - content: Content involved in action
  ///   - name: Action name, mostly used if `actionType` is `Custom`
  ///   - id: Identifier for collection view to track.
  @objc(collectionActionDidOccur:content:name:collectionID:)
  func collectionActionDidOccur(
    actionType: Int,
    content: ReactNativeDictionary?,
    name: String,
    id: String
  ) {
    guard let tracker = idToImpressionTracker[id] else { return }
    let a = ActionType(rawValue: actionType) ?? .unknown
    let c = Content(content)
    let impressionID = tracker.impressionID(for: c)
    print("***** \(#function) \(name) \(c) \(impressionID)")
    metricsLogger?.logAction(
      type: a,
      content: c,
      impressionID: impressionID,
      name: name
    )
  }

  /// Ends tracking session for given collection view.
  /// Drops all associated impression logging state.
  ///
  /// - Parameter id: Identifier for collection view to track.
  @objc(collectionWillUnmount:)
  func collectionWillUnmount(id: String) {
    guard let tracker = idToImpressionTracker.removeValue(forKey: id) else {
      return
    }
    tracker.collectionViewDidHideAllContent()
  }
}

// MARK: - Ancestor IDs
public extension PromotedMetricsModule {
  @objc(getCurrentOrPendingAncestorIds:rejecter:)
  func currentOrPendingAncestorIDs(
    resolver: RCTPromiseResolveBlock,
    rejecter: RCTPromiseRejectBlock
  ) {
    guard let metricsLogger = metricsLogger else {
      resolver([:])
      return
    }
    let sessionInfo = [
      "logUserId": metricsLogger.currentOrPendingLogUserID,
      "sessionId": metricsLogger.currentOrPendingSessionID,
      "viewId": metricsLogger.currentOrPendingViewID,
    ]
    resolver(sessionInfo)
  }

  @objc(setAncestorIds:)
  func setAncestorIDs(_ ancestorIDs: ReactNativeDictionary?) {
    guard let metricsLogger = metricsLogger else { return }
    if let logUserID = ancestorIDs?["logUserId"] as? String {
      metricsLogger.logUserID = logUserID
    }
    if let sessionID = ancestorIDs?["sessionId"] as? String {
      metricsLogger.sessionID = sessionID
    }
    if let viewID = ancestorIDs?["viewId"] as? String {
      metricsLogger.viewID = viewID
    }
  }
}

private typealias ReactNativeDictionary =
  PromotedMetricsModule.ReactNativeDictionary

private extension Content {

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

private extension ReactNativeDictionary {
  func valueForCalledPropertyNameAsKey<T>(function: String = #function) -> T? {
    return self[function] as? T
  }

  var content: ReactNativeDictionary? { valueForCalledPropertyNameAsKey() }

  var routeName: String? { valueForCalledPropertyNameAsKey() }

  var routeKey: String? { valueForCalledPropertyNameAsKey() }

  var autoViewID: String? { self["autoViewId"] as? String }
}

private extension PromotedMetricsModule.LogImpressionArgs {
  var impressionSourceType: ImpressionSourceType? {
    ImpressionSourceType(rawValue: (self["sourceType"] as? Int) ?? 0)
  }
}

private extension PromotedMetricsModule.LogActionArgs {
  var actionType: ActionType? {
    ActionType(rawValue: (self["type"] as? Int) ?? 0)
  }

  var destinationScreenName: String? { valueForCalledPropertyNameAsKey() }

  var actionName: String? { valueForCalledPropertyNameAsKey() }
}
