import { NativeModules } from 'react-native';

enum ActionType {
  Unknown = 0,
  Custom = 1,
  Click = 2,
  Purchase = 3,
  AddToCart = 4,
  Share = 5,
  Like = 6,
  Comment = 7
};

type PromotedMetricsType = {
  startSessionAndLogUser(userId: string): void;
  startSessionAndLogSignedOutUser(): void;

  // Impression logging

  logImpression(content: Object): void;

  // Click logging
  
  logNavigateAction(screenName: string): void;
  logNavigateActionWithContent(screenName: string, content: Object): void;
  logClickToSignUp(userId: string): void;
  logPurchaseAction(item: Object): void;
  logAddToCartAction(item: Object): void;
  logShareAction(content: Object): void;
  logLikeAction(content: Object, didLike: boolean): void;
  logCommentAction(content: Object): void;
  logAction(name: string): void;
  logActionWithType(name: string, type: ActionType): void;
  logActionWithContent(name: string, type: ActionType, content: Object): void;

  // View logging

  logView(screenName: string): void;

  // Impression logging

  /**
   * Begins tracking session for given collection view.
   * Can be called multiple times in succession, such as when a collection
   * view reloads on a timer. In these cases, the impression logging state
   * from the previous session will persist.
   *
   * @param collectionViewName identifier for collection view to track
   */
  collectionViewDidLoad(collectionViewName: string): void;
  
  /**
   * Logs impressions for changed content.
   * Call this method with currently visible content and the underlying
   * `ImpressionLogger` will calculate deltas and log appropriate events.
   *
   * @param visibleContent list of currently visible content
   * @param collectionViewName identifier for collection view to track
   */
  collectionViewDidChange(visibleContent: Array<Object>, collectionViewName: string): void;

  /**
   * Ends tracking session for given collection view.
   * Drops all associated impression logging state.
   * 
   * @param collectionViewName identifier for collection view to track
   */
  collectionViewDidUnmount(collectionViewName: string): void;
};

const { PromotedMetrics } = NativeModules;

export default PromotedMetrics as PromotedMetricsType;
export { ActionType };
