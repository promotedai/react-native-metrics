import * as React from 'react';
import { NativeModules, TouchableWithoutFeedback } from 'react-native';
import { TapGestureHandler } from 'react-native-gesture-handler';
import { v4 as uuidv4 } from 'uuid';
import { ImpressionSourceType } from './ImpressionSourceType';
import { useImpressionTracker } from './useImpressionTracker';

const { PromotedMetrics } = NativeModules;

export interface WithCollectionTrackerProps {
  onViewableItemsChanged: (any) => void;
  renderItem: (any) => any;
  viewabilityConfig: any;
  viewabilityConfigCallbackPairs: Array<any>;
}

export interface WithCollectionTrackerArgs {
  contentCreator: (any) => Object;
  sourceType: ImpressionSourceType;
}

export const withCollectionTracker = <
  P extends WithCollectionTrackerProps
>(
  Component: React.ComponentType<P>,
  args: WithCollectionTrackerArgs
) => {
  const { contentCreator, sourceType } = args;
  const WrappedComponent = (
    {
      onViewableItemsChanged,
      renderItem,
      viewabilityConfig,
      viewabilityConfigCallbackPairs,
      ...rest
    }: P
  ) : React.ReactElement => {

    const trackerId = uuidv4();
    const {
      _viewabilityConfig,
      _onViewableItemsChanged,
    } = useImpressionTracker(
      ({ item }) => (contentCreator(item)),
      trackerId,
      sourceType,
    );

    const _viewabilityPairs = [
      ...(viewabilityConfigCallbackPairs || []),
      ...((onViewableItemsChanged && viewabilityConfig)
        ? [{ onViewableItemsChanged, viewabilityConfig }]
        : []),
      {
        onViewableItemsChanged: _onViewableItemsChanged,
        viewabilityConfig: _viewabilityConfig,
      },
    ];
    const _viewabilityPairsRef = React.useRef(_viewabilityPairs);

    const _renderItem = React.useCallback(
      ({ item }) => {
        return (
          <TouchableWithoutFeedback
            onResponderGrant={(evt) => {
              console.log(`onResponderGrant ${item}`);
            }}
            onResponderReject={(evt) => {
              console.log(`onResponderReject ${item}`);
            }}
            onStartShouldSetResponder={(evt) => true}
            >
            {renderItem({ item })}
          </TouchableWithoutFeedback>
        );
      },
      [renderItem]
    );

    // TODO: Override renderItem and replace the responder
    // callbacks there.

    return (
      <Component
        renderItem={_renderItem}
        viewabilityConfigCallbackPairs={_viewabilityPairsRef.current}
        {...rest}
      />
    );
  };

  WrappedComponent.displayName = `withCollectionTracker(
    ${Component.displayName || Component.name}
  )`;

  return WrappedComponent;
}
