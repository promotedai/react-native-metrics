import { NativeModules } from 'react-native'
import type { PromotedMetricsType } from './PromotedMetricsType'

const { PromotedMetrics } = NativeModules

export default PromotedMetrics as PromotedMetricsType
export type { AncestorIds } from './PromotedMetricsType'
export { ActionType } from './ActionType'
export { CollectionActionState, CollectionTracker, useCollectionActionState, useCollectionTracker } from './CollectionTracker'
export type { CollectionTrackerArgs, CollectionTrackerProps } from './CollectionTracker'
export { ImpressionSourceType } from './ImpressionSourceType'
export { useImpressionTracker, promotedViewabilityConfig } from './useImpressionTracker'
export { useAutoViewState } from './ViewTracker'
