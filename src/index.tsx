import { NativeModules } from 'react-native';

type PromotedMetricsType = {
  startSessionAndLogUser(userId: string): void;
};

const { PromotedMetrics } = NativeModules;

export default PromotedMetrics as PromotedMetricsType;
