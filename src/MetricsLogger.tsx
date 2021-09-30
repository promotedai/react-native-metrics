import { NativeModules } from 'react-native'
import { v4 as uuidv4 } from 'uuid'

import { ImpressionSourceType } from './ImpressionSourceType'
import type { PromotedMetricsType } from './PromotedMetricsType'
import { AutoViewState, useAutoViewState  } from './ViewTracker'

import type {
  LogImpressionArgs,
  LogActionArgs,
  LogViewArgs,
} from './LoggerArgs'

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
 * use the scoped version when available. See
 * `useUnscopedMetricsLogger()`.
 */
export class MetricsLogger {

  autoViewState?: AutoViewState

  constructor(
    autoViewState?: AutoViewState
  ) {
    this.autoViewState = autoViewState
  }

  logImpression({
    content,
    sourceType = ImpressionSourceType.Unknown,
  }: LogImpressionArgs): void {
    P.logImpression({
      content,
      sourceType,
      autoViewId: this.autoViewState.autoViewId,
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
      autoViewId: this.autoViewState.autoViewId,
    })
  }

  logView({
    routeName,
    routeKey,
  }: LogViewArgs): void {
    const viewId = uuidv4()
    P.logView({ routeName, routeKey })
  }
}

export function useMetricsLogger() {
  const autoViewState = useAutoViewState()
  return new MetricsLogger(autoViewState)
}

export function useUnscopedMetricsLogger() {
  return new MetricsLogger(null)
}

export function withMetricsLogger<P>(
  Component: React.ComponentType<P>
) {
  const MetricsLoggerComponent = ({
    ...rest
  }) : React.ReactElement => {
    const autoViewState = useAutoViewState()
    const metricsLogger = new MetricsLogger(autoViewState)
    return (
      <Component
        autoViewState={autoViewState}
        metricsLogger={metricsLogger}
        {...rest}
      />
    )
  }
  return MetricsLoggerComponent
}
