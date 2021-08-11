import type { ActionType } from './ActionType';
import type { ImpressionSourceType } from './ImpressionSourceType';

/**
 * Marketplace content (saleable item, partner) involved with
 * Promoted delivery.
 */
export interface Content {
  contentId?: string
  insertionId?: string
  name?: string
};

/** Provides session context for Promoted integration points. */
export interface AncestorIds {
  logUserId?: string;
  sessionId?: string;
  viewId?: string;
};

// Maintainers:
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
   * Typically, you would call withCollectionTracker() for use with
   * SectionLists and FlatLists. This method should only be used
   * outside of those components.
   */
  logImpression(content: Object): void;

  /**
   * Logs an impression for given content.
   * Typically, you would call withCollectionTracker() for use with
   * SectionLists and FlatLists. This method should only be used
   * outside of those components.
   */
  logImpressionWithSourceType(content: Object, sourceType: ImpressionSourceType): void;

  // Action logging

  /**
   * Logs a clickthrough for details about given content.
   *
   * @param content content whose details are requested
   */
  logNavigateAction(content: Object): void;

  /**
   * Logs a clickthrough for details about given content.
   *
   * @param content content whose details are requested
   * @param screenName name of screen that will display content details
   */
   logNavigateActionWithScreenName(content: Object, screenName: string): void;

  /**
   * Logs an action on given content.
   *
   * @param type Semantic meaning of action in marketplace.
   *   If you use CustomActionType, provide a name for the action
   *   using logActionWithName.
   * @param content content whose details are requested
   */
  logAction(type: ActionType, content: Object): void;

  /**
   * Logs an action on given content.
   * Any action type can have a custom name to distinguish different
   * actions in the same class. If you use ActionType.CustomActionType,
   * use this method and provide a name for the action.
   *
   * @param type semantic meaning of action in marketplace
   * @param content content whose details are requested
   * @param name custom name for action
   */
  logActionWithName(type: ActionType, content: Object, name: string): void;

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
   * @param id identifier for collection view to track
   * @param sourceType origin of impressed content
   */
  collectionViewDidMount(id: string, sourceType: ImpressionSourceType): void;

  /**
   * Logs impressions for changed content.
   * Call this method with currently visible content and the underlying
   * `ImpressionLogger` will calculate deltas and log appropriate events.
   *
   * @param visibleContent list of currently visible content
   * @param id identifier for collection view to track
   */
  collectionViewDidChange(visibleContent: Array<Object>, id: string): void;

  /**
   * Logs actions for content in a given collection view.
   * Call this method when an action occurs within a tracked collection view.
   *
   * @param actionType see `ActionType`
   * @param content content for which action occurred
   * @param id identifier for collection view to track
   */
  collectionViewActionDidOccur(actionType: ActionType, content: Object, id: string): void;

  /**
   * Ends tracking session for given collection view.
   * Drops all associated impression logging state.
   *
   * @param id identifier for collection view to track
   */
  collectionViewWillUnmount(id: string): void;

  // Ancestor IDs

  /** Returns ancestor IDs that will be used for initial values. */
  getCurrentOrPendingAncestorIds(): Promise<AncestorIds>;

  /** Sets external ancestor IDs in logger. */
  setAncestorIds(ancestorIds: AncestorIds): void;
};
