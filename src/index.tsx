import { NativeModules } from 'react-native'

import type { PromotedMetricsType } from './PromotedMetricsType'

const { PromotedMetrics } = NativeModules
export default PromotedMetrics as PromotedMetricsType

export type {
  AncestorIds,
} from './PromotedMetricsType'

export {
  ActionType,
} from './ActionType'

export {
  CollectionActionState,
  CollectionTracker,
  useCollectionActionLogger,
  useCollectionTracker,
} from './CollectionTracker'

export type {
  CollectionTrackerArgs,
  CollectionTrackerProps,
} from './CollectionTracker'

export type {
  Content,
} from './Content'

export {
  ImpressionSourceType,
} from './ImpressionSourceType'

export type {
  LogActionArgs,
  LogImpressionArgs,
  LogViewArgs,
} from './LoggerArgs'

export {
  MetricsLogger,
  useMetricsLogger,
  useUnscopedMetricsLogger,
  withMetricsLogger,
} from './MetricsLogger'

export {
  useImpressionTracker,
} from './useImpressionTracker'
