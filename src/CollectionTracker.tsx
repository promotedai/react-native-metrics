import * as React from 'react'
import { NativeModules, View } from 'react-native'
import { State, TapGestureHandler } from 'react-native-gesture-handler'
import { useNavigation } from 'react-navigation-hooks'
import { v4 as uuidv4 } from 'uuid'

import { ActionType } from './ActionType'
import type { Content } from './PromotedMetricsType'
import type { ImpressionSourceType } from './ImpressionSourceType'
import { useImpressionTracker } from './useImpressionTracker'

const { PromotedMetrics } = NativeModules

export interface CollectionTrackerProps {
  onViewableItemsChanged: (any) => void
  renderItem: (any) => any
  viewabilityConfig: any
  viewabilityConfigCallbackPairs: Array<any>
}

export interface CollectionTrackerArgs {
  contentCreator: (any) => Content
  sourceType: ImpressionSourceType
}

export function CollectionTracker<
  P extends CollectionTrackerProps
>(
  args: CollectionTrackerArgs
) {
  return (Component: React.ComponentType<P>) => {
    const { contentCreator, sourceType } = args
    const trackerId = uuidv4()

    const WrappedComponent = (
      {
        onViewableItemsChanged,
        renderItem,
        viewabilityConfig,
        viewabilityConfigCallbackPairs,
        ...rest
      }: P
    ) : React.ReactElement => {
      const navigation = useNavigation()

      // Merge existing viewability configs with our own.
      const {
        _viewabilityConfig,
        _onViewableItemsChanged,
      } = useImpressionTracker(
        ({ item }) => contentCreator(item),
        trackerId,
        sourceType,
      )
      const _viewabilityPairs = React.useRef([
        ...(viewabilityConfigCallbackPairs || []),
        ...((onViewableItemsChanged != null && viewabilityConfig != null)
          ? [{ onViewableItemsChanged, viewabilityConfig }]
          : []),
        {
          onViewableItemsChanged: _onViewableItemsChanged,
          viewabilityConfig: _viewabilityConfig,
        },
      ])

      // Wrap the rendered item with an action logger.
      const _renderItem = ({ item }) => {
        const _onTapForItem = (item) => (event) => {
          if (event.nativeEvent.state === State.ACTIVE) {
            console.log('***** onTap ', contentCreator(item))
            PromotedMetrics.collectionViewActionDidOccur(
              ActionType.Navigate,
              contentCreator(item),
              trackerId
            )
          }
        }
        return (
          <TapGestureHandler
            onGestureEvent={_onTapForItem(item)}
            onHandlerStateChange={_onTapForItem(item)}
          >
            <View>
              {renderItem({ item })}
            </View>
          </TapGestureHandler>
        )
      }

      return (
        <Component
          renderItem={_renderItem}
          viewabilityConfigCallbackPairs={_viewabilityPairs.current}
          {...rest}
        />
      )
    }

    WrappedComponent.displayName = `withCollectionTracker(${
      Component.displayName || Component.name
    })`

    return WrappedComponent //React.useCallback(WrappedComponent, [])
  }
}

export function useCollectionTracker<
  P extends CollectionTrackerProps
>(
  args: CollectionTrackerArgs
) {
  return (Component: React.ComponentType<P>) => {
    return React.useCallback(CollectionTracker(args), [])
  }
}
