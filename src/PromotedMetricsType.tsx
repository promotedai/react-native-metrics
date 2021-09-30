import type { ActionType } from './ActionType'
import type { ImpressionSourceType } from './ImpressionSourceType'
import type {
  InternalLogImpressionArgs,
  InternalLogActionArgs,
  LogAutoViewArgs,
  LogViewArgs,
} from './LoggerArgs'

/** Provides session context for Promoted integration points. */
export interface AncestorIds {
  logUserId?: string
  sessionId?: string
  viewId?: string
}

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
  startSessionAndLogUser(
    userId: string
  ): void

  /**
   * Call when sign-in completes with no user.
   * Starts logging session with signed-out user and logs a
   * user event.
   */
  startSessionAndLogSignedOutUser(): void

  /**
   * Logs an impression for given content.
   * Typically, you would call withCollectionTracker() for use with
   * SectionLists and FlatLists. This method should only be used
   * outside of those components.
   */
  logImpression({
    content,
    sourceType,
    autoViewId,
  }: InternalLogImpressionArgs): void

  /**
   * Logs an action on given content.
   * Any action type can have a custom name to distinguish different
   * actions in the same class. If you use ActionType.CustomActionType,
   * use this method and provide a name for the action.
   */
  logAction({
    content,
    type,
    destinationScreenName,
    actionName,
    autoViewId,
  }: InternalLogActionArgs): void

  // View logging

  /**
   * Logs a screen view. Prefer to use `CollectionTracker` and
   * `ViewTracker` if you can. In situations where you cannot do so,
   * such as logging a view for a screen that generates no impressions
   * or action, use this method.
   */
  logView({
    routeName,
    routeKey,
  }: LogViewArgs): void

  /**
   * Used internally to log auto views.
   * Don't call this method from outside the `@promotedai` library.
   */
  logAutoView({
    routeName,
    routeKey,
    autoViewId,
  }: LogAutoViewArgs): void

  // Collection tracking

  /**
   * Begins tracking session for given collection view.
   * Can be called multiple times in succession, such as when a collection
   * view reloads on a timer. In these cases, the impression logging state
   * from the previous session will persist.
   *
   * @param id identifier for collection view to track
   * @param sourceType origin of impressed content
   */
  collectionDidMount(
    id: string,
    sourceType: ImpressionSourceType
  ): void

  /**
   * Logs impressions for changed content.
   * Call this method with currently visible content and the underlying
   * `ImpressionLogger` will calculate deltas and log appropriate events.
   *
   * @param visibleContent list of currently visible content
   * @param id identifier for collection view to track
   */
  collectionDidChange(
    visibleContent: Array<Object>,
    id: string
  ): void

  /**
   * Logs actions for content in a given collection view.
   * Call this method when an action occurs within a tracked collection view.
   *
   * @param actionType see `ActionType`
   * @param content content for which action occurred
   * @param name action name, if `actionType` is Custom
   * @param id identifier for collection view to track
   */
  collectionActionDidOccur(
    actionType: ActionType,
    content: Object,
    name: string,
    id: string
  ): void

  /**
   * Ends tracking session for given collection view.
   * Drops all associated impression logging state.
   *
   * @param id identifier for collection view to track
   */
  collectionWillUnmount(
    id: string
  ): void

  // Ancestor IDs

  /** Returns ancestor IDs that will be used for initial values. */
  getCurrentOrPendingAncestorIds(): Promise<AncestorIds>

  /** Sets external ancestor IDs in logger. */
  setAncestorIds(
    ancestorIds: AncestorIds
  ): void
}
