import { NavigationContainer } from '@react-navigation/native';
import { MutableRefObject } from 'react';
import { NativeModules } from 'react-native';

const { PromotedMetrics } = NativeModules;

/**
 * Returns handlers for use with onReady and onStateChange for
 * NavigationContainers.
 */
export const useViewTracker = (navigationRef: MutableRefObject<NavigationContainer>) => {

  const _onReady = async () => {
    const currentRoute = navigationRef.current?.getCurrentRoute();
    PromotedMetrics.logViewReady(currentRoute.name, currentRoute.key);
  }

  const _onStateChange = async () => {
    const currentRoute = navigationRef.current?.getCurrentRoute();
    PromotedMetrics.logViewChange(currentRoute.name, currentRoute.key);
  }

  return { _onReady, _onStateChange }
};
