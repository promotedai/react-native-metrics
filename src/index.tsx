import { NativeModules } from 'react-native';
import type { PromotedMetricsType } from './PromotedMetricsType';

const { PromotedMetrics } = NativeModules;

export default PromotedMetrics as PromotedMetricsType;
export type { LoggingSessionInfo } from './PromotedMetricsType';
export type { ActionType } from './ActionType';
export { useImpressionLogger } from './useImpressionLogger';
export { useViewTracker } from './useViewTracker';
