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

    // Merge existing viewability configs with our own.
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

    // Wrap the rendered item with an action logger.
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

    return (
      <Component
        renderItem={_renderItem}
        viewabilityConfigCallbackPairs={_viewabilityPairs}
        {...rest}
      />
    );
  };

  WrappedComponent.displayName = `withCollectionTracker(
    ${Component.displayName || Component.name}
  )`;

  return WrappedComponent;
}
