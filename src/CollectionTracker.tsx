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
 *
 * - *Click tracking* requires support for `renderItem`.
 * - *Impression tracking* requires support for one of the following:
 *   - `viewabilityConfig` and `onViewableItemsChanged`, if you do not
 *     have your own viewability configuration, *or*:
 *   - `viewabilityConfigCallbackPairs`, if you have your own viewabilty
 *     configuration that needs to run alongside impression tracking.
 *
 * If your component doesn't support the required properties for both click
 * tracking and impression tracking, CollectionTracker still works with what
 * you have. That is, if you support `renderItem`, then wrapping your list
 * in CollectionTracker will give you only click tracking.
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

export interface CollectionActionState {
  actionType: ActionType
  name: string
}

const TrackerContext = React.createContext({
  setActionState: (args: CollectionActionState) => {},
})

export function useCollectionActionState() {
  const context = React.useContext(TrackerContext)
  return ({
    actionType,
    name = '',
  }: CollectionActionState) => {
    context.setActionState({ actionType, name })
  }
}

/**
 * CollectionTracker wraps a list component to add action and impression
 * tracking for Promoted backends. It works with `FlatList` and `SectionList`,
 * or any component that supports the required properties.
 *
 * This version is for use with class components. For functional components,
 * see `useCollectionTracker`.
 *
 * # Usage
 *
 * CollectionTracker does a drop-in replacement of the list component and
 * requires minimal configuration. Just supply a `contentCreator` and a
 * source for the content, and use it in place of your list component.
 * ```
 * const TrackedList = CollectionTracker({
 *   contentCreator: (item) => ({
 *     contentId: item.marketplaceId,
 *     insertionId: item.insertionId,
 *     name: item.displayName,
 *   }),
 * })(FlatList)
 *
 * class MyItemList extends PureComponent<...> {
 *   public render() {
 *     return (
 *       <TrackedList
 *         data={myData}
 *         renderItem={myRenderItem}
 *         {...props}
 *       />
 *     )
 *   }
 * }
 * ```
 *
 * # Implementation Details
 *
 * If you use CollectionTracker with your own component, it must support
 * support the following properties as defined in `CollectionTrackerProps`.
 *
 * ## Action Tracking
 *
 * Action tracking wraps your `renderItem` function to return a
 * `TapGestureHandler` to surround the component that you render. This
 * handler listens for tap events and records them as Promoted actions.
 * The content for these actions is derived by applying `contentCreator`
 * to the argument of `renderItem`.
 *
 * This handler does not consume the tap event or alter the existing
 * behavior of your rendered items in any other way.
 *
 * ## Impression Tracking
 *
 * Impression tracking uses the `VirtualizedList` mechanism for viewability
 * tracking. In most cases, this uses the `onViewableItemsChanged` and
 * `viewabilityConfig` properties on the list. If you already supply
 * viewability tracking properties to the list, then they are merged into
 * the `viewabilityConfigCallbackPairs` property. The aforementioned
 * property will include both viewability tracking for Promoted impressions
 * and your existing viewability tracking.
 *
 * @returns Wrapped component to use as list component
 */
export function CollectionTracker<P extends CollectionTrackerProps>({
  contentCreator,
  sourceType = ImpressionSourceType.Unknown,
} : CollectionTrackerArgs) {
  return (Component: React.ComponentType<P>) => {
    const trackerId = uuidv4()

    const WrappedComponent = ({
      onViewableItemsChanged,
      renderItem,
      viewabilityConfig,
      viewabilityConfigCallbackPairs,
      ...rest
    } : P) : React.ReactElement => {
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

      const [actionState, setActionState] = React.useState({
        actionType: ActionType.Unknown,
        name: '',
      } as CollectionActionState)

      // Wrap the rendered item with an action logger.
      // TODO: Allow configuration so that controls within
      // the rendered item can trigger different actions.
      const _renderItem = ({ item }) => {
        const _onTapForItem = (item) => (event) => {
          switch (event.nativeEvent.state) {
          case State.BEGAN:
            setActionState({
              actionType: null,
              name: null,
            })
            break
          case State.ACTIVE:
            const actionType = actionState.actionType ?? ActionType.Navigate
            const actionName = actionState.name ?? ''
            PromotedMetrics.collectionViewActionDidOccur(
              actionType,
              contentCreator(item),
              actionName,
              trackerId
            )
            break
          }
          console.log('tap state: ', event.nativeEvent.state, event.nativeEvent.target)
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
        <TrackerContext.Provider
          value={{setActionState: args => { setActionState(args) }}}
          >
          <Component
            renderItem={_renderItem}
            {...viewabilityArgs}
            {...rest}
          />
        </TrackerContext.Provider>
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
 * components. Usage:
 * ```
 * const MyListComponent: FunctionComponent<MyListProps> = (props) => {
 *   // Wrap the list component before use.
 *   const TrackedList = useCollectionTracker({
 *     contentCreator: (item) => ({
 *       contentId: item.internalId.toString(),
 *       insertionId: item.insertionId,
 *       name: item.displayName,
 *     }),
 *     sourceType: ImpressionSourceType.Delivery,
 *   })(FlatList)
 *   // Instantiate the tracked list.
 *   return (
 *     <TrackedList
 *       data={...}
 *       renderItem={...}
 *       {...rest}
 *     />
 *   )
 * }
 * ```
 * Note that `useCollectionTracker` must be called to wrap the component
 * class *before* the component is initialized. In the example above, this
 * means that `const TrackedList = useCollectionTracker(...)` occurs before
 * the use of the list component. The return value of `useCollectionTracker`
 * is then instantiated as `TrackedList` and used as the result of the
 * component `MyListComponent`.
 *
 * You must wrap a component class that supports the properties in
 * `CollectionTrackerProps` for action/impression tracking to work.
 * See documentation on `CollectionTracker` for more details.
 *
 * @see CollectionTracker
 * @see CollectionTrackerProps
 * @returns Wrapped component to use as list component
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
