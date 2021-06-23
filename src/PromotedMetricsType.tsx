import type { ActionType } from './ActionType';
import type { ImpressionSourceType } from './ImpressionSourceType';

/** Provides session context for Promoted integration points. */
export interface AncestorIds {
  logUserId?: string;
  sessionId?: string;
  viewId?: string;
};

// IF YOU CHANGE THIS FILE, also update BuildProject/App.tsx
// to include a test for your change.

/** Logging interface. */
export type PromotedMetricsType = {
  /**
   * Call when sign-in completes with specified user ID.
   * Starts logging session with the provided user and logs a
   * user event.
   */
  startSessionAndLogUser(userId: string): void;

  /**
   * Call when sign-in completes with no user.
   * Starts logging session with signed-out user and logs a
   * user event.
   */
  startSessionAndLogSignedOutUser(): void;

  // Impression logging
  /**
   * Logs an impression for given content.
   * Typically, you would call useImpressionTracker() for use with
   * SectionLists and FlatLists. This method should only be used
   * outside of those components.
   */
  logImpression(content: Object): void;

  /**
   * Logs an impression for given content.
   * Typically, you would call useImpressionTracker() for use with
   * SectionLists and FlatLists. This method should only be used
   * outside of those components.
   */
  logImpressionWithSourceType(content: Object, sourceType: ImpressionSourceType): void;

  // Action logging

  logNavigateAction(screenName: string): void;
  logNavigateActionWithContent(screenName: string, content: Object): void;
  logAddToCartAction(item: Object): void;
  logRemoveFromCartAction(item: Object): void;
  logCheckoutAction(): void;
  logPurchaseAction(item: Object): void;
  logShareAction(content: Object): void;
  logLikeAction(content: Object): void;
  logUnlikeAction(content: Object): void;
  logCommentAction(content: Object): void;
  logMakeOfferAction(content: Object): void;
  logAskQuestionAction(content: Object): void;
  logAnswerQuestionAction(content: Object): void;
  logCompleteSignInAction(): void;
  logCompleteSignUpAction(): void;
  logAction(name: string): void;
  logActionWithType(name: string, type: ActionType): void;
  logActionWithContent(name: string, type: ActionType, content: Object): void;

  // View logging

  /**
   * Logs a screen view. Use with NavigationContainer's onReady handler
   * to provide the name and key from the current navigation route.
   */
  logViewReady(routeName: string, routeKey: string): void;

  /**
   * Logs a screen view. Use with NavigationContainer's onChange handler
   * to provide the name and key from the current navigation route.
   */
  logViewChange(routeName: string, routeKey: string): void;

  // Impression logging

  /**
   * Begins tracking session for given collection view.
   * Can be called multiple times in succession, such as when a collection
   * view reloads on a timer. In these cases, the impression logging state
   * from the previous session will persist.
   *
   * @param collectionViewName identifier for collection view to track
   * @param sourceType origin of impressed content
   */
  collectionViewDidMount(collectionViewName: string, sourceType: ImpressionSourceType): void;

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
  collectionViewWillUnmount(collectionViewName: string): void;

  // Ancestor IDs

  /** Returns ancestor IDs that will be used for initial values. */
  getCurrentOrPendingAncestorIds(): Promise<AncestorIds>;

  /** Sets external ancestor IDs in logger. */
  setAncestorIds(ancestorIds: AncestorIds): void;
};
