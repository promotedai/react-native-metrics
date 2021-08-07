import * as React from 'react';
import { NativeModules, View } from 'react-native';
import { State, TapGestureHandler } from 'react-native-gesture-handler';
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
    const _onTapForItem = (item) =>
      (event) => {
        console.log('***** onTap ', item.title, event.nativeEvent.state);
        if (event.nativeEvent.state === State.ACTIVE) {
          //alert('***** Active');
        }
      };
    const _renderItem = React.useCallback(
      ({ item }) => {
        return (
          <TapGestureHandler
            onGestureEvent={_onTapForItem(item)}
            onHandlerStateChange={_onTapForItem(item)}
          >
            <View>
              {renderItem({ item })}
            </View>
          </TapGestureHandler>
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

  WrappedComponent.displayName = `withCollectionTracker(${
    Component.displayName || Component.name
  })`;

  return React.useCallback(WrappedComponent, [contentCreator, sourceType]);
}
