import { NativeModules } from 'react-native';
import { PromotedMetricsType } from './PromotedMetricsType';

const { PromotedMetrics } = NativeModules;

export default PromotedMetrics as PromotedMetricsType;
export type { ActionType, LoggingSessionInfo } from './PromotedMetricsType';
export { useImpressionLogger } from './useImpressionLogger';
export { useViewTracker } from './useViewTracker';
