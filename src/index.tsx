import { NativeModules } from 'react-native';
import type { PromotedMetricsType } from './PromotedMetricsType';

const { PromotedMetrics } = NativeModules;

export default PromotedMetrics as PromotedMetricsType;
export type { AncestorIds } from './PromotedMetricsType';
export { ActionType } from './ActionType';
export { ImpressionSourceType } from './ImpressionSourceType';
export { useImpressionTracker, promotedViewabilityConfig } from './useImpressionTracker';
export { useViewTracker } from './useViewTracker';
