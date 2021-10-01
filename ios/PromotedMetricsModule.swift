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

  public typealias CollectionDidMountArgs = ReactNativeDictionary
  public typealias CollectionDidChangeArgs = ReactNativeDictionary
  public typealias CollectionActionDidOccurArgs = ReactNativeDictionary
  public typealias CollectionWillUnmountArgs = ReactNativeDictionary

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
    guard let args = args else { return }
    metricsLogger?.logImpression(
      content: args.content,
      sourceType: args.impressionSourceType,
      viewID: args.autoViewID
    )
  }

  // MARK: - Actions
  @objc(logAction:)
  func logAction(_ args: LogActionArgs?) {
    guard let args = args else { return }
    metricsLogger?.logAction(
      type: args.actionType,
      content: args.content,
      name: args.destinationScreenName ?? args.actionName,
      viewID: args.autoViewID
    )
  }

  // MARK: - Views
  @objc(logView:)
  func logView(_ args: LogViewArgs?) {
    guard let args = args else { return }
    metricsLogger?.logView(
      routeName: args.routeName,
      routeKey: args.routeKey
    )
  }

  @objc(logAutoView:)
  func logAutoView(_ args: LogAutoViewArgs?) {
    guard let args = args else { return }
    print("***** \(#function) \(args)")
    metricsLogger?.logAutoView(
      routeName: args.routeName,
      routeKey: args.routeKey,
      autoViewID: args.autoViewID
    )
  }
}

// MARK: - CollectionTracker
public extension PromotedMetricsModule {

  /// Begins tracking session for given collection view.
  /// Can be called multiple times in succession, such as when a collection
  /// view reloads on a timer. In these cases, the impression logging state
  /// from the previous session will persist.
  @objc(collectionDidMount:)
  func collectionDidMount(_ args: CollectionDidMountArgs?) {
    guard let args = args, let id = args.collectionID else { return }
    // A load without a previous unmount can be due to a page refresh.
    // Don't recreate the logger in this case.
    if let _ = idToImpressionTracker[id] { return }
    print("***** \(#function) \(args)")
    let s = args.impressionSourceType
    if let tracker = service?.impressionTracker()?.with(sourceType: s) {
      idToImpressionTracker[id] = tracker
    }
  }

  /// Logs impressions for changed content.
  /// Call this method with currently visible content and the underlying
  /// `ImpressionTracker` will calculate deltas and log appropriate events.
  @objc(collectionDidChange:)
  func collectionDidChange(_ args: CollectionDidChangeArgs?) {
    guard
      let args = args,
      let id = args.collectionID,
      let tracker = idToImpressionTracker[id]
    else { return }
    print("***** \(#function) collectionID:\(args.collectionID ?? "nil") autoViewID:\(args.autoViewID ?? "nil")")
    tracker.collectionViewDidChangeVisibleContent(
      args.visibleContent,
      autoViewID: args.autoViewID
    )
  }

  /// Logs actions for content in a given collection view.
  /// Call this method when an action occurs within a tracked collection view.
  ///
  /// - Parameters:
  ///   - actionType: As defined by `ActionType`.
  ///   - content: Content involved in action
  ///   - name: Action name, mostly used if `actionType` is `Custom`
  ///   - id: Identifier for collection view to track.
  @objc(collectionActionDidOccur:)
  func collectionActionDidOccur(_ args: CollectionActionDidOccurArgs?) {
    guard
      let args = args,
      let id = args.collectionID,
      let tracker = idToImpressionTracker[id]
    else { return }
    let content = args.content
    let impressionID = tracker.impressionID(for: content)
    print("***** \(#function) \(args)")
    metricsLogger?.logAction(
      type: args.actionType,
      content: content,
      name: args.actionName,
      autoViewID: args.autoViewID,
      hasSuperimposedViews: args.hasSuperimposedViews,
      impressionID: impressionID
    )
  }

  /// Ends tracking session for given collection view.
  /// Drops all associated impression logging state.
  ///
  /// - Parameter id: Identifier for collection view to track.
  @objc(collectionWillUnmount:)
  func collectionWillUnmount(_ args: CollectionWillUnmountArgs?) {
    guard
      let args = args,
      let id = args.collectionID,
      let tracker = idToImpressionTracker.removeValue(forKey: id)
    else { return }
    print("***** \(#function) \(args)")
    tracker.collectionViewDidHideAllContent(autoViewID: args.autoViewID)
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

  var collectionID: String? { self["collectionId"] as? String }

  var content: Content { Content(valueForCalledPropertyNameAsKey()) }

  var destinationScreenName: String? { valueForCalledPropertyNameAsKey() }

  var hasSuperimposedViews: Bool { valueForCalledPropertyNameAsKey() ?? false }

  var impressionSourceType: ImpressionSourceType {
    ImpressionSourceType(
      rawValue: (self["sourceType"] as? Int) ?? 0
    ) ?? .unknown
  }

  var routeName: String? { valueForCalledPropertyNameAsKey() }

  var routeKey: String? { valueForCalledPropertyNameAsKey() }

  var visibleContent: [Content] {
    (self["visibleContent"] as? [ReactNativeDictionary] ?? [])
      .map { Content($0) }
  }
}
