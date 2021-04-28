import Foundation
import PromotedAIMetricsSDK

// MARK: -
/**
 `MetricsLogger` methods packaged as a module. Has many of the same methods
 as `MetricsLogger` and `ImpressionLogger`, but delegates those methods to
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
  
  /// Local reference to `MetricsLoggerService`, if any.
  private let memberService: MetricsLoggerService?
 
  /// Uses local reference if present, shared service otherwise.
  private var service: MetricsLoggerService {
    if let s = memberService { return s }
    return MetricsLoggerService.shared
  }

  private var metricsLogger: MetricsLogger? { service.metricsLogger }
  
  private var config: ClientConfig { service.config }
    
  private var nameToImpressionLogger: [String: ImpressionLogger]
  
  @objc public override convenience init() {
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
    self.memberService = optionalMetricsLoggerService
    self.nameKeys = nameKeys!
    self.contentIDKeys = contentIDKeys!
    self.insertionIDKeys = insertionIDKeys!
    self.nameToImpressionLogger = [:]
  }

  @objc public var methodQueue: DispatchQueue {
    return DispatchQueue.main
  }
  
  @objc public static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
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
    guard config.loggingEnabled else { return }
    metricsLogger?.startSessionAndLogUser(userID: userID)
  }
  
  @objc(startSessionAndLogSignedOutUser)
  func startSessionAndLogSignedOutUser() {
    guard config.loggingEnabled else { return }
    metricsLogger?.startSessionAndLogSignedOutUser()
  }
  
  // MARK: - Impressions
  @objc(logImpression:)
  func logImpression(content: ReactNativeDictionary?) {
    guard config.loggingEnabled else { return }
    metricsLogger?.logImpression(content: contentFor(content))
  }
  
  // MARK: - Clicks
  @objc(logNavigateAction:)
  func logNavigateAction(screenName: String) {
    guard config.loggingEnabled else { return }
    metricsLogger?.logNavigateAction(screenName: screenName)
  }
  
  @objc(logNavigateActionWithContent:forContent:)
  func logNavigateAction(screenName: String,
                         forContent content: ReactNativeDictionary?) {
    guard config.loggingEnabled else { return }
    metricsLogger?.logNavigateAction(screenName: screenName,
                                     forContent: contentFor(content))
  }
  
  @objc(logAddToCartAction:)
  func logAddToCartAction(item: ReactNativeDictionary?) {
    guard config.loggingEnabled else { return }
    metricsLogger?.logAddToCartAction(item: itemFor(item))
  }
  
  @objc(logRemoveFromCartAction:)
  func logRemoveFromCartAction(item: ReactNativeDictionary?) {
    guard config.loggingEnabled else { return }
    metricsLogger?.logRemoveFromCartAction(item: itemFor(item))
  }

  @objc(logCheckoutAction)
  func logCheckoutAction() {
    guard config.loggingEnabled else { return }
    metricsLogger?.logCheckoutAction()
  }

  @objc(logPurchaseAction:)
  func logPurchaseAction(item: ReactNativeDictionary?) {
    guard config.loggingEnabled else { return }
    metricsLogger?.logPurchaseAction(item: itemFor(item))
  }
  
  @objc(logShareAction:)
  func logShareAction(content: ReactNativeDictionary?) {
    guard config.loggingEnabled else { return }
    metricsLogger?.logShareAction(content: contentFor(content))
  }

  @objc(logLikeAction:)
  func logLikeAction(content: ReactNativeDictionary?) {
    guard config.loggingEnabled else { return }
    metricsLogger?.logLikeAction(content: contentFor(content))
  }
  
  @objc(logUnlikeAction:)
  func logUnlikeAction(content: ReactNativeDictionary?) {
    guard config.loggingEnabled else { return }
    metricsLogger?.logUnlikeAction(content: contentFor(content))
  }
  
  @objc(logCommentAction:)
  func logCommentAction(content: ReactNativeDictionary?) {
    guard config.loggingEnabled else { return }
    metricsLogger?.logCommentAction(content: contentFor(content))
  }
  
  @objc(logMakeOfferAction:)
  func logMakeOfferAction(item: ReactNativeDictionary?) {
    guard config.loggingEnabled else { return }
    metricsLogger?.logMakeOfferAction(item: itemFor(item))
  }
  
  @objc(logAskQuestionAction:)
  func logAskQuestionAction(content: ReactNativeDictionary?) {
    guard config.loggingEnabled else { return }
    metricsLogger?.logAskQuestionAction(content: contentFor(content))
  }
  
  @objc(logAnswerQuestionAction:)
  func logAnswerQuestionAction(content: ReactNativeDictionary?) {
    guard config.loggingEnabled else { return }
    metricsLogger?.logAnswerQuestionAction(content: contentFor(content))
  }
  
  @objc(logCompleteSignInAction)
  func logCompleteSignInAction() {
    guard config.loggingEnabled else { return }
    metricsLogger?.logCompleteSignInAction()
  }
  
  @objc(logCompleteSignUpAction)
  func logCompleteSignUpAction() {
    guard config.loggingEnabled else { return }
    metricsLogger?.logCompleteSignUpAction()
  }

  @objc(logAction:)
  func logAction(name: String) {
    guard config.loggingEnabled else { return }
    metricsLogger?.logAction(name: name)
  }

  @objc(logActionWithType:type:)
  func logAction(name: String, type: Int) {
    guard config.loggingEnabled else { return }
    if let actionType = ActionType(rawValue: type) {
      metricsLogger?.logAction(name: name, type: actionType)
    }
  }

  @objc(logActionWithContent:type:content:)
  func logAction(name: String, type: Int, content: ReactNativeDictionary?) {
    guard config.loggingEnabled else { return }
    if let actionType = ActionType(rawValue: type) {
      metricsLogger?.logAction(name: name, type: actionType, content: contentFor(content))
    }
  }

  // MARK: - Views
  @objc(logViewReady:routeKey:)
  func logViewReady(routeName: String, routeKey: String) {
    guard config.loggingEnabled else { return }
    metricsLogger?.logViewReady(routeName: routeName, routeKey: routeKey)
  }

  @objc(logViewReadyWithUseCase:routeKey:useCase:)
  func logViewReady(routeName: String, routeKey: String, useCase: Int) {
    guard config.loggingEnabled else { return }
    if let u = UseCase(rawValue: useCase) {
      metricsLogger?.logViewReady(routeName: routeName, routeKey: routeKey, useCase: u)
    }
  }

  @objc(logViewChange:routeKey:)
  func logViewChange(routeName: String, routeKey: String) {
    guard config.loggingEnabled else { return }
    metricsLogger?.logViewChange(routeName: routeName, routeKey: routeKey)
  }

  @objc(logViewChangeWithUseCase:routeKey:useCase:)
  func logViewChange(routeName: String, routeKey: String, useCase: Int) {
    guard config.loggingEnabled else { return }
    if let u = UseCase(rawValue: useCase) {
      metricsLogger?.logViewChange(routeName: routeName, routeKey: routeKey, useCase: u)
    }
  }
}

// MARK: - ImpressionLogger
public extension PromotedMetricsModule {

  /// Begins tracking session for given collection view.
  /// Can be called multiple times in succession, such as when a collection
  /// view reloads on a timer. In these cases, the impression logging state
  /// from the previous session will persist.
  ///
  /// - Parameter collectionViewName: Identifier for collection view to track.
  @objc(collectionViewDidLoad:)
  func collectionViewDidLoad(collectionViewName: String) {
    guard config.loggingEnabled else { return }
    // A load without a previous unmount can be due to a page refresh.
    // Don't recreate the logger in this case.
    if let _ = nameToImpressionLogger[collectionViewName] { return }
    if let logger = service.impressionLogger() {
      nameToImpressionLogger[collectionViewName] = logger
    }
  }

  /// Logs impressions for changed content.
  /// Call this method with currently visible content and the underlying
  /// `ImpressionLogger` will calculate deltas and log appropriate events.
  ///
  /// - Parameters:
  ///   - visibleContent: List of currently visible content.
  ///   - collectionViewName: Identifier for collection view to track.
  @objc(collectionViewDidChange:collectionViewName:)
  func collectionViewDidChange(visibleContent: [AnyObject], collectionViewName: String) {
    guard config.loggingEnabled else { return }
    guard let logger = nameToImpressionLogger[collectionViewName] else { return }
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
  @objc(collectionViewDidUnmount:)
  func collectionViewDidUnmount(collectionViewName: String) {
    guard config.loggingEnabled else { return }
    if let logger = nameToImpressionLogger.removeValue(forKey: collectionViewName) {
      logger.collectionViewDidHideAllContent()
    }
  }
}

// MARK: - Session information
public extension PromotedMetricsModule {
  @objc(getLoggingSessionInfo:rejecter:)
  func loggingSessionInfo(resolver: RCTPromiseResolveBlock, rejecter: RCTPromiseRejectBlock) {
    guard config.loggingEnabled,
          let metricsLogger = metricsLogger else {
      resolver([:])
      return
    }
    let sessionInfo = [
      "logUserId": metricsLogger.logUserID,
      "sessionId": metricsLogger.sessionID,
      "viewId": metricsLogger.viewID,
    ]
    resolver(sessionInfo)
  }
}
