import type { ActionType } from './ActionType'
import type { Content } from './Content'
import type { ImpressionSourceType } from './ImpressionSourceType'

export type AutoViewIdArgs = {
  /** Auto view ID for event. */
  autoViewId?: string
  /** Whether this view may not be topmost. */
  hasSuperimposedViews: boolean
}

/** Arguments for `logImpression`. */
export type LogImpressionArgs = {
  /** Content involved in the impression. */
  content: Content

  /** Index path for visible content. */
  indexPath?: Array<number>

  /** Source type of impressed content. */
  sourceType?: ImpressionSourceType
}

export type InternalLogImpressionArgs = (
  LogImpressionArgs & AutoViewIdArgs
)

/** Arguments for `logAction`. */
export type LogActionArgs = {
  /** Content involved in the action. */
  content?: Content

  /**
   * Semantic meaning of action in marketplace.
   * Prefer to distinguish actions by `type` instead of by
   * `actionName`. If you use `CustomActionType` though, provide a
   * name for the action using `actionName`.
   */
  actionType?: ActionType

  /**
   * For `Navigate` actions, name of screen that will display
   * content details.
   */
  destinationScreenName?: string

  /**
   * Custom name for action.
   * Prefer to distinguish actions by `type` instead of by
   * `actionName`. If you use `CustomActionType` though, provide a
   * name for the action using `actionName`.
   */
  actionName?: string

  /** Index path for visible content. */
  indexPath?: Array<number>
}

export type InternalLogActionArgs = (
  LogActionArgs & AutoViewIdArgs
)

/** Arguments for `logView`. */
export type LogViewArgs = {
  /** navigation.state.routeName */
  routeName: string

  /** navigation.state.key */
  routeKey: string
}

/** Arguments for `logAutoView`. */
export type LogAutoViewArgs = {
  /** navigation.state.routeName */
  routeName: string

  /** navigation.state.key */
  routeKey: string

  /**
   * Auto view ID as generated by `ViewTracker`.
   *
   * # Implementation Notes
   *
   * Auto view ID is generated on the React Native side, because the
   * logic that determines when it should change lives here.
   *
   * Action and impression IDs are handled in native code because
   * `ImpressionTracker` logic is shared across native and RN.
   */
  autoViewId?: string
}
