import { NativeModules } from 'react-native';

type PromotedMetricsType = {
  startSessionAndLogUser(userId: string): void;
  startSessionAndLogSignedOutUser(): void;

  // Impression logging

  logImpression(content: Object): void;

  // Click logging

  logClickToLike(content: Object, didLike: boolean): void;
  logClickToShow(screenName: string): void;
  logClickToShow(screenName: string, content: Object): void;
  logClickToSignUp(userId: string): void;
  logClickToPurchase(item: Object): void;
  logAction(name: string): void;
  logActionWithContent(name: string, content: Object): void;

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
