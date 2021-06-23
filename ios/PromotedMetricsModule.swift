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

  public static let defaultNameKeys = ["name"]
  public static let defaultContentIDKeys = ["content_id", "contentId", "_id"]
  public static let defaultInsertionIDKeys = ["insertion_id", "insertionId"]

  /// Dictionary objects that represent content as expected from React Native.
  public typealias ReactNativeDictionary = [String: Any]

  /// List of keys for content name as used in
  /// `Content(properties:contentIDKeys:insertionIDKeys:)`.
  private let nameKeys: [String]

  /// List of keys for content IDs as used in
  /// `Content(properties:contentIDKeys:insertionIDKeys:)`.
  private let contentIDKeys: [String]

  /// List of keys for insertion IDs as used in
  /// `Content(properties:contentIDKeys:insertionIDKeys:)`.
  private let insertionIDKeys: [String]

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

  public convenience init(metricsLoggerService: MetricsLoggerService,
                          nameKeys: [String]? = defaultNameKeys,
                          contentIDKeys: [String]? = defaultContentIDKeys,
                          insertionIDKeys: [String]? = defaultInsertionIDKeys) {
    self.init(optionalMetricsLoggerService: metricsLoggerService,
              nameKeys: nameKeys,
              contentIDKeys: contentIDKeys,
              insertionIDKeys: insertionIDKeys)
  }

  private init(optionalMetricsLoggerService: MetricsLoggerService?,
               nameKeys: [String]? = defaultNameKeys,
               contentIDKeys: [String]? = defaultContentIDKeys,
               insertionIDKeys: [String]? = defaultInsertionIDKeys) {
    self.service = optionalMetricsLoggerService
    self.nameKeys = nameKeys!
    self.contentIDKeys = contentIDKeys!
    self.insertionIDKeys = insertionIDKeys!
    self.nameToImpressionTracker = [:]
  }

  @objc public var methodQueue: DispatchQueue { DispatchQueue.main }

  @objc public static func requiresMainQueueSetup() -> Bool { true }

  private func contentFor(_ dictionary: ReactNativeDictionary?) -> Content {
    return Content(properties: dictionary,
                   nameKeys: nameKeys,
                   contentIDKeys: contentIDKeys,
                   insertionIDKeys: insertionIDKeys)
  }

  private func itemFor(_ dictionary: ReactNativeDictionary?) -> Item {
    return Item(properties: dictionary,
                nameKeys: nameKeys,
                contentIDKeys: contentIDKeys,
                insertionIDKeys: insertionIDKeys)
  }
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
  @objc(logImpression:sourceType:)
  func logImpression(content: ReactNativeDictionary?, sourceType: Int) {
    let s = ImpressionSourceType(rawValue: sourceType) ?? .unknown
    metricsLogger?.logImpression(content: contentFor(content), sourceType: s)
  }

  // MARK: - Clicks
  @objc(logNavigateAction:)
  func logNavigateAction(screenName: String) {
    metricsLogger?.logNavigateAction(screenName: screenName)
  }

  @objc(logNavigateActionWithContent:forContent:)
  func logNavigateAction(screenName: String,
                         forContent content: ReactNativeDictionary?) {
    metricsLogger?.logNavigateAction(screenName: screenName,
                                     forContent: contentFor(content))
  }

  @objc(logAddToCartAction:)
  func logAddToCartAction(item: ReactNativeDictionary?) {
    metricsLogger?.logAddToCartAction(item: itemFor(item))
  }

  @objc(logRemoveFromCartAction:)
  func logRemoveFromCartAction(item: ReactNativeDictionary?) {
    metricsLogger?.logRemoveFromCartAction(item: itemFor(item))
  }

  @objc(logCheckoutAction)
  func logCheckoutAction() {
    metricsLogger?.logCheckoutAction()
  }

  @objc(logPurchaseAction:)
  func logPurchaseAction(item: ReactNativeDictionary?) {
    metricsLogger?.logPurchaseAction(item: itemFor(item))
  }

  @objc(logShareAction:)
  func logShareAction(content: ReactNativeDictionary?) {
    metricsLogger?.logShareAction(content: contentFor(content))
  }

  @objc(logLikeAction:)
  func logLikeAction(content: ReactNativeDictionary?) {
    metricsLogger?.logLikeAction(content: contentFor(content))
  }

  @objc(logUnlikeAction:)
  func logUnlikeAction(content: ReactNativeDictionary?) {
    metricsLogger?.logUnlikeAction(content: contentFor(content))
  }

  @objc(logCommentAction:)
  func logCommentAction(content: ReactNativeDictionary?) {
    metricsLogger?.logCommentAction(content: contentFor(content))
  }

  @objc(logMakeOfferAction:)
  func logMakeOfferAction(item: ReactNativeDictionary?) {
    metricsLogger?.logMakeOfferAction(item: itemFor(item))
  }

  @objc(logAskQuestionAction:)
  func logAskQuestionAction(content: ReactNativeDictionary?) {
    metricsLogger?.logAskQuestionAction(content: contentFor(content))
  }

  @objc(logAnswerQuestionAction:)
  func logAnswerQuestionAction(content: ReactNativeDictionary?) {
    metricsLogger?.logAnswerQuestionAction(content: contentFor(content))
  }

  @objc(logCompleteSignInAction)
  func logCompleteSignInAction() {
    metricsLogger?.logCompleteSignInAction()
  }

  @objc(logCompleteSignUpAction)
  func logCompleteSignUpAction() {
    metricsLogger?.logCompleteSignUpAction()
  }

  @objc(logAction:)
  func logAction(name: String) {
    metricsLogger?.logAction(name: name)
  }

  @objc(logActionWithType:type:)
  func logAction(name: String, type: Int) {
    let actionType = ActionType(rawValue: type) ?? .unknownActionType
    metricsLogger?.logAction(name: name, type: actionType)
  }

  @objc(logActionWithContent:type:content:)
  func logAction(name: String, type: Int, content: ReactNativeDictionary?) {
    let actionType = ActionType(rawValue: type) ?? .unknownActionType
    metricsLogger?.logAction(name: name, type: actionType, content: contentFor(content))
  }

  // MARK: - Views
  @objc(logViewReady:routeKey:)
  func logViewReady(routeName: String, routeKey: String) {
    metricsLogger?.logViewReady(routeName: routeName, routeKey: routeKey)
  }

  @objc(logViewReadyWithUseCase:routeKey:useCase:)
  func logViewReady(routeName: String, routeKey: String, useCase: Int) {
    let u = UseCase(rawValue: useCase) ?? .unknown
    metricsLogger?.logViewReady(routeName: routeName, routeKey: routeKey, useCase: u)
  }

  @objc(logViewChange:routeKey:)
  func logViewChange(routeName: String, routeKey: String) {
    metricsLogger?.logViewChange(routeName: routeName, routeKey: routeKey)
  }

  @objc(logViewChangeWithUseCase:routeKey:useCase:)
  func logViewChange(routeName: String, routeKey: String, useCase: Int) {
    let u = UseCase(rawValue: useCase) ?? .unknown
    metricsLogger?.logViewChange(routeName: routeName, routeKey: routeKey, useCase: u)
  }
}

// MARK: - ImpressionTracker
public extension PromotedMetricsModule {

  /// Begins tracking session for given collection view.
  /// Can be called multiple times in succession, such as when a collection
  /// view reloads on a timer. In these cases, the impression logging state
  /// from the previous session will persist.
  ///
  /// - Parameter collectionViewName: Identifier for collection view to track.
  @objc(collectionViewDidMount:sourceType:)
  func collectionViewDidMount(collectionViewName: String, sourceType: Int) {
    // A load without a previous unmount can be due to a page refresh.
    // Don't recreate the logger in this case.
    if let _ = nameToImpressionTracker[collectionViewName] { return }
    let s = ImpressionSourceType(rawValue: sourceType) ?? .unknown
    if let logger = service?.impressionTracker()?.with(sourceType: s) {
      nameToImpressionTracker[collectionViewName] = logger
    }
  }

  /// Logs impressions for changed content.
  /// Call this method with currently visible content and the underlying
  /// `ImpressionTracker` will calculate deltas and log appropriate events.
  ///
  /// - Parameters:
  ///   - visibleContent: List of currently visible content.
  ///   - collectionViewName: Identifier for collection view to track.
  @objc(collectionViewDidChange:collectionViewName:)
  func collectionViewDidChange(visibleContent: [AnyObject], collectionViewName: String) {
    guard let logger = nameToImpressionTracker[collectionViewName] else { return }
    var contentList = [Content]()
    for obj in visibleContent {
      guard let reactDict = obj as? ReactNativeDictionary else { continue }
      let content = contentFor(reactDict)
      contentList.append(content)
    }
    logger.collectionViewDidChangeVisibleContent(contentList)
  }

  /// Ends tracking session for given collection view.
  /// Drops all associated impression logging state.
  ///
  /// - Parameter collectionViewName: Identifier for collection view to track.
  @objc(collectionViewWillUnmount:)
  func collectionViewWillUnmount(collectionViewName: String) {
    if let logger = nameToImpressionTracker.removeValue(forKey: collectionViewName) {
      logger.collectionViewDidHideAllContent()
    }
  }
}

// MARK: - Ancestor IDs
public extension PromotedMetricsModule {
  @objc(getCurrentOrPendingAncestorIds:rejecter:)
  func currentOrPendingAncestorIDs(resolver: RCTPromiseResolveBlock,
                                   rejecter: RCTPromiseRejectBlock) {
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
