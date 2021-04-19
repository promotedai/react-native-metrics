import { NativeModules } from 'react-native';
import { PromotedMetricsType, ActionType, LoggingSessionInfo } from './PromotedMetricsType';

const { PromotedMetrics } = NativeModules;

export default PromotedMetrics as PromotedMetricsType;
export type { ActionType, LoggingSessionInfo };
export { useImpressionLogger } from './useImpressionLogger';
export { useViewTracker } from './useViewTracker';
