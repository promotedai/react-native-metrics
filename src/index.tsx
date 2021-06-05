import { NativeModules } from 'react-native';
import type { PromotedMetricsType } from './PromotedMetricsType';

const { PromotedMetrics } = NativeModules;

export default PromotedMetrics as PromotedMetricsType;
export type { AncestorIds } from './PromotedMetricsType';
export { ActionType } from './ActionType';
export { useImpressionLogger, promotedViewabilityConfig } from './useImpressionLogger';
export { useViewTracker } from './useViewTracker';
