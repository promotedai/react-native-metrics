import { NativeModules } from 'react-native'
import { ImpressionSourceType } from './ImpressionSourceType'
import type { PromotedMetricsType } from './PromotedMetricsType'
import { withAutoViewTracker  } from './ViewTracker'

import type {
  LogImpressionArgs,
  LogActionArgs,
  LogViewArgs,
} from './Types'

const { PromotedMetrics } = NativeModules
const P = PromotedMetrics as PromotedMetricsType

/**
 * You can create a `MetricsLogger` tied into a Component
 * in the hierarchy to automatically inherit the view scope
 * of that Component. See `useMetricsLogger()`.
 *
 * Alternatively, if no Component is available to you, you
 * can create an unscoped `MetricsLogger` that inherits the
 * frontmost view scope. This is not the preferred usage;
 * prefer the scoped version when available. See
 * `useUnscopedMetricsLogger()`.
 */
export class MetricsLogger {

  autoViewId?: string

  constructor(
    autoViewId?: string
  ) {
    this.autoViewId = autoViewId
  }

  logImpression({
    content,
    sourceType = ImpressionSourceType.Unknown,
  }: LogImpressionArgs): void {
    P.logImpression({
      content,
      sourceType,
      autoViewId: this.autoViewId,
    })
  }

  logAction({
    content,
    type,
    destinationScreenName = '',
    actionName = '',
  }: LogActionArgs): void {
    P.logAction({
      content,
      type,
      destinationScreenName,
      actionName,
      autoViewId: this.autoViewId,
    })
  }

  logView({
    routeName,
    routeKey,
  }: LogViewArgs): void {
    P.logView({ routeName, routeKey })
  }
}

export function useMetricsLogger() {

}

export function useUnscopedMetricsLogger() {
  return new MetricsLogger(null)
}

/**
 * Creates a scoped `MetricsLogger` tied to a given Component.
 */
export function withMetricsLogger(
  Component: React.ComponentType
) {
  return withAutoViewTracker(Component)
}
