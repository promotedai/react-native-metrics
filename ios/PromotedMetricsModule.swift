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

  private let service: MetricsLoggerService?
  private var metricsLogger: MetricsLogger? { service?.metricsLogger }
  private var nameToImpressionTracker: [String: ImpressionTracker]

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
    self.nameToImpressionTracker = [:]
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
  func logImpression(content: ReactNativeDictionary?) {
    metricsLogger?.logImpression(content: Content(content))
  }

  @objc(logImpressionWithSourceType:sourceType:)
  func logImpression(content: ReactNativeDictionary?, sourceType: Int) {
    let s = ImpressionSourceType(rawValue: sourceType) ?? .unknown
    metricsLogger?.logImpression(content: Content(content), sourceType: s)
  }

  // MARK: - Clicks
  @objc(logNavigateAction:)
  func logNavigateAction(content: ReactNativeDictionary?) {
    metricsLogger?.logNavigateAction(content: Content(content))
  }

  @objc(logNavigateActionWithScreenName:screenName:)
  func logNavigateAction(
    content: ReactNativeDictionary?,
    screenName: String
  ) {
    metricsLogger?.logNavigateAction(
      content: Content(content),
      screenName: screenName
    )
  }

  @objc(logAction:content:)
  func logAction(type: Int, content: ReactNativeDictionary?) {
    let actionType = ActionType(rawValue: type) ?? .unknown
    metricsLogger?.logAction(type: actionType, content: Content(content))
  }

  @objc(logActionWithName:content:name:)
  func logAction(type: Int, content: ReactNativeDictionary?, name: String) {
    let actionType = ActionType(rawValue: type) ?? .unknown
    metricsLogger?.logAction(
      type: actionType,
      content: Content(content),
      name: name
    )
  }

  // MARK: - Views
  @objc(logViewReady:routeKey:)
  func logViewReady(routeName: String, routeKey: String) {
    metricsLogger?.logViewReady(routeName: routeName, routeKey: routeKey)
  }

  @objc(logViewReadyWithUseCase:routeKey:useCase:)
  func logViewReady(routeName: String, routeKey: String, useCase: Int) {
    let u = UseCase(rawValue: useCase) ?? .unknown
    metricsLogger?.logViewReady(
      routeName: routeName,
      routeKey: routeKey,
      useCase: u
    )
  }

  @objc(logViewChange:routeKey:)
  func logViewChange(routeName: String, routeKey: String) {
    metricsLogger?.logViewChange(routeName: routeName, routeKey: routeKey)
  }

  @objc(logViewChangeWithUseCase:routeKey:useCase:)
  func logViewChange(routeName: String, routeKey: String, useCase: Int) {
    let u = UseCase(rawValue: useCase) ?? .unknown
    metricsLogger?.logViewChange(
      routeName: routeName,
      routeKey: routeKey,
      useCase: u
    )
  }
}

// MARK: - ImpressionTracker
public extension PromotedMetricsModule {

  /// Begins tracking session for given collection view.
  /// Can be called multiple times in succession, such as when a collection
  /// view reloads on a timer. In these cases, the impression logging state
  /// from the previous session will persist.
  ///
  /// - Parameters:
  ///   - id: Identifier for collection view to track.
  ///   - sourceType: Source of content in collection view.
  @objc(collectionViewDidMount:sourceType:)
  func collectionViewDidMount(id: String, sourceType: Int) {
    // A load without a previous unmount can be due to a page refresh.
    // Don't recreate the logger in this case.
    if let _ = nameToImpressionTracker[id] { return }
    let s = ImpressionSourceType(rawValue: sourceType) ?? .unknown
    if let tracker = service?.impressionTracker()?.with(sourceType: s) {
      nameToImpressionTracker[id] = tracker
    }
  }

  /// Logs impressions for changed content.
  /// Call this method with currently visible content and the underlying
  /// `ImpressionTracker` will calculate deltas and log appropriate events.
  ///
  /// - Parameters:
  ///   - visibleContent: List of currently visible content.
  ///   - id: Identifier for collection view to track.
  @objc(collectionViewDidChange:collectionID:)
  func collectionViewDidChange(visibleContent: [AnyObject], id: String) {
    guard let tracker = nameToImpressionTracker[id] else { return }
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
  @objc(collectionViewActionDidOccur:content:name:collectionID:)
  func collectionViewActionDidOccur(
    actionType: Int,
    content: ReactNativeDictionary?,
    name: String,
    id: String
  ) {
    guard let tracker = nameToImpressionTracker[id] else { return }
    let a = ActionType(rawValue: actionType) ?? .unknown
    let c = Content(content)
    let impressionID = tracker.impressionID(for: c)
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
  @objc(collectionViewWillUnmount:)
  func collectionViewWillUnmount(id: String) {
    guard let tracker = nameToImpressionTracker.removeValue(forKey: id) else {
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

private extension Content {

  static let nameKeys = ["name"]
  static let contentIDKeys = ["contentId"]
  static let insertionIDKeys = ["insertionId"]

  convenience init(_ dict: PromotedMetricsModule.ReactNativeDictionary?) {
    self.init(
      properties: dict,
      nameKeys: Self.nameKeys,
      contentIDKeys: Self.contentIDKeys,
      insertionIDKeys: Self.insertionIDKeys
    )
  }
}
