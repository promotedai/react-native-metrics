import Foundation
import PromotedAIMetricsSDK

// MARK: -
/**
 `MetricsLogger` methods packaged as a module. Has many of the same methods
 as `MetricsLogger` and `ImpressionLogger`, but delegates those methods to
 instances of those loggers.
 */
@objc(PromotedMetrics)
public class PromotedMetrics: NSObject {
  
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
    return MetricsLoggerService.sharedService
  }

  private var metricsLogger: MetricsLogger {
    return service.metricsLogger
  }
  
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

public extension PromotedMetrics {
  // MARK: - Starting new sessions
  @objc(startSessionAndLogUser:)
  func startSessionAndLogUser(userID: String) {
    metricsLogger.startSessionAndLogUser(userID: userID)
  }
  
  @objc func startSessionAndLogSignedOutUser() {
    metricsLogger.startSessionAndLogSignedOutUser()
  }
  
  // MARK: - Impressions
  @objc(logImpression:)
  func logImpression(content: ReactNativeDictionary?) {
    metricsLogger.logImpression(content: contentFor(content))
  }
  
  // MARK: - Clicks
  @objc(logClickToLike:didLike:)
  func logClickToLike(content: ReactNativeDictionary?, didLike: Bool) {
    metricsLogger.logClickToLike(content: contentFor(content), didLike: didLike)
  }
  
  @objc(logClickToShow:)
  func logClickToShow(screenName: String) {
    metricsLogger.logClickToShow(screenName: screenName)
  }
  
  @objc(logClickToShow:forContent:)
  func logClickToShow(screenName: String,
                      forContent content: ReactNativeDictionary?) {
    metricsLogger.logClickToShow(screenName: screenName,
                                 forContent: contentFor(content))
  }
  
  @objc(logClickToSignUp:)
  func logClickToSignUp(userID: String) {
    metricsLogger.logClickToSignUp(userID: userID)
  }
    
  @objc(logClickToPurchase:)
  func logClickToPurchase(item: ReactNativeDictionary?) {
    metricsLogger.logClickToPurchase(item: itemFor(item))
  }
  
  @objc func logClick(actionName: String) {
    metricsLogger.logClick(actionName: actionName)
  }
  
  @objc func logClick(actionName: String, content: ReactNativeDictionary?) {
    metricsLogger.logClick(actionName: actionName, content: contentFor(content))
  }
  
  // MARK: - Views
  @objc(logView:)
  func logView(screenName: String) {
    metricsLogger.logView(screenName: screenName)
  }
  
  @objc(logView:useCase:)
  func logView(screenName: String, useCase: UseCase) {
    metricsLogger.logView(screenName: screenName, useCase: useCase)
  }
}

// MARK: - ImpressionLogger
public extension PromotedMetrics {

  /// Begins tracking session for given collection view.
  /// Can be called multiple times in succession, such as when a collection
  /// view reloads on a timer. In these cases, the impression logging state
  /// from the previous session will persist.
  ///
  /// - Parameter collectionViewName: Identifier for collection view to track.
  @objc(collectionViewDidLoad:)
  func collectionViewDidLoad(collectionViewName: String) {
    // A load without a previous unmount can be due to a page refresh.
    // Don't recreate the logger in this case.
    if let _ = nameToImpressionLogger[collectionViewName] { return }
    let logger = service.impressionLogger()
    nameToImpressionLogger[collectionViewName] = logger
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
    if let logger = nameToImpressionLogger.removeValue(forKey: collectionViewName) {
      logger.collectionViewDidHideAllContent()
    }
  }
}
