import * as React from 'react'
import { NativeModules, View } from 'react-native'
import { State, TapGestureHandler } from 'react-native-gesture-handler'
import { v4 as uuidv4 } from 'uuid'

import { ActionType } from './ActionType'
import type { Content } from './PromotedMetricsType'
import { ImpressionSourceType } from './ImpressionSourceType'
import { useImpressionTracker } from './useImpressionTracker'

const { PromotedMetrics } = NativeModules

/**
 * Properties for a component that can be wrapped by CollectionTracker.
 * The most common component is VirtualizedList, in the form of FlatList
 * or SectionList.
 *
 * If you wrap your own component with CollectionTracker, it must support
 * the following operations:
 * <ul>
 * <li>*Click tracking* requires support for `renderItem`.
 * <li>*Impression tracking* requires support for one of the following:
 *   <ul>
 *   <li>`viewabilityConfig` and `onViewableItemsChanged`, if you do not
 *       have your own viewability configuration, *or*:
 *   <li>`viewabilityConfigCallbackPairs`, if you have your own viewabilty
 *       configuration that needs to run alongside impression tracking.
 *   </ul>
 * </ul>
 * If your component doesn't support the required properties for both click
 * tracking and impression tracking, CollectionTracker still works with what
 * you have. That is, if you support `renderItem`, then wrapping your list
 * in CollectionTracker will give you click tracking.
 *
 * @see CollectionTracker
 */
export interface CollectionTrackerProps {
  onViewableItemsChanged: (any) => void
  renderItem: (any) => any
  viewabilityConfig: any
  viewabilityConfigCallbackPairs: Array<any>
}

/** Arguments to configure CollectionTracker. */
export interface CollectionTrackerArgs {
  /** Function to map list items to Promoted Content. */
  contentCreator: (any) => Content

  /** Source of presented list content. Default: ClientBackend. */
  sourceType: ImpressionSourceType
}

export function CollectionTracker<P extends CollectionTrackerProps>({
  contentCreator,
  sourceType = ImpressionSourceType.ClientBackend
} : CollectionTrackerArgs) {
  return (Component: React.ComponentType<P>) => {
    const trackerId = uuidv4()

    const WrappedComponent = ({
      onViewableItemsChanged,
      renderItem,
      viewabilityConfig,
      viewabilityConfigCallbackPairs,
      ...rest
    }: P) : React.ReactElement => {
      const {
        _viewabilityConfig,
        _onViewableItemsChanged,
      } = useImpressionTracker(
        ({ item }) => contentCreator(item),
        trackerId,
        sourceType,
      )

      // Merge existing viewability configs with our own if needed.
      // Otherwise, just use our viewability config.
      const viewabilityArgs = (
        onViewableItemsChanged ||
        viewabilityConfig ||
        viewabilityConfigCallbackPairs
      ) ? {
        viewabilityConfigCallbackPairs: React.useRef([
          ...(viewabilityConfigCallbackPairs || []),
          ...((onViewableItemsChanged != null && viewabilityConfig != null)
            ? [{ onViewableItemsChanged, viewabilityConfig }]
            : []),
          {
            onViewableItemsChanged: _onViewableItemsChanged,
            viewabilityConfig: _viewabilityConfig,
          },
        ])
      } : {
        onViewableItemsChanged: _onViewableItemsChanged,
        viewabilityConfig: _viewabilityConfig,
      }

      // Wrap the rendered item with an action logger.
      // TODO: Allow configuration so that controls within
      // the rendered item can trigger different actions.
      const _renderItem = ({ item }) => {
        const _onTapForItem = (item) => (event) => {
          if (event.nativeEvent.state === State.ACTIVE) {
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
          {...viewabilityArgs}
          {...rest}
        />
      )
    }

    WrappedComponent.displayName = `CollectionTracker(${
      Component.displayName || Component.name
    })`

    return WrappedComponent
  }
}

/**
 * Wraps a component with CollectionTracker for use with *functional*
 * components.
 *
 * @see CollectionTracker
 * @param args CollectionTracker configuration
 * @returns wrapped component
 */
export function useCollectionTracker<P extends CollectionTrackerProps>({
  contentCreator,
  sourceType = ImpressionSourceType.ClientBackend
} : CollectionTrackerArgs) {
  return (Component: React.ComponentType<P>) => {
    return React.useCallback(
      CollectionTracker({ contentCreator, sourceType })(Component),
      []
    )
  }
}
