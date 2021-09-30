import * as React from 'react'
import { NativeModules, View } from 'react-native'
import { State, TapGestureHandler } from 'react-native-gesture-handler'
import { v4 as uuidv4 } from 'uuid'

import { ActionType } from './ActionType'
import type { Content } from './Content'
import { ImpressionSourceType } from './ImpressionSourceType'
import { useAutoViewState } from './ViewTracker'
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

/** Arguments for function returned by `useCollectionActionState()`. */
export interface CollectionActionState {
  actionType?: ActionType
  name?: string
}

/** React.Context used to send the state-setting function to children. */
const CollectionTrackerContext = React.createContext({
  // @ts-ignore (TS6133: CollectionActionState declared but not used)
  setActionState: (CollectionActionState) => {},
})

/**
 * If your list items contain accessory views that perform actions on list
 * content other than Navigate, then use the function returned from this
 * hook to indicate the type and name of the action.
 *
 * Use of this hook is *optional*. If your list items don't contain controls
 * for other action types, you don't need to call this. CollectionTracker
 * will automatically log Navigate actions for the items in your list.
 *
 * List components wrapped with CollectionTracker will pass `setActionState`
 * as a parameter to `renderItem`. You can use that parameter as a function
 * to set the action type/name instead. This is mostly for use in class
 * components. See `CollectionTracker`.
 *
 * # Usage
 *
 * ## Functional Components
 *
 * Suppose you have a list item with a "Like" button, and tapping on this
 * button should record `ActionType.Like/Unlike`. In your `renderItem`
 * function, add the following to the event handler for your "Like" button:
 * ```
 * const renderItem = ({ item }) => {
 *   const { setActionState } = useCollectionActionState()
 *   const likeButtonHandler = () => {
 *     // Report this tap is ActionType.Like to Promoted.
 *     // The rest of the details are automatically filled in.
 *     setActionState({
 *       actionType: ActionType.Like
 *     })
 *     likeItem(item)
 *   }
 *   const moreLikeThisButtonHandler = () => {
 *     // Report a custom action to Promoted.
 *     setActionState({
 *       actionType: ActionType.Custom,
 *       name: 'MoreLikeThis'
 *     })
 *     showMoreLikeThis(item)
 *   }
 *   const showButtonHandler = () => {
 *     // Don't call setActionState to default Promoted to
 *     // ActionType.Navigate.
 *     showItem(item)
 *   }
 *   // ... Rest of handlers
 *   return (
 *     <MyItem>
 *       // ... Rest of component
 *       <ShowButton onPress={showButtonHandler} />
 *       <LikeButton onPress={likeButtonHandler} />
 *       <MoreLikeThisButton onPress={moreLikeThisButtonHandler} />
 *     </MyItem>
 *   )
 * }
 * ```
 * This hook returns a function that you can call from your handler like
 * the above example. If you don't call the function, then any taps on
 * your list item will be recorded as `ActionType.Navigate`.
 *
 * To prevent Promoted from logging any actions, call
 * `setActionState({ actionType: null })`.
 *
 * ## Class Components
 *
 * See `CollectionTracker` for details on accessory view action logging with
 * class components.
 *
 * # Implementation Details
 *
 * Uses a React.Context passed in from the containing CollectionTracker-
 * wrapped component. Your list items must be descendants of that component.
 * Calling this hook outside of a functional component body or from a
 * component that is not a CollectionTracker descendant will cause a runtime
 * error.
 *
 * The function returned from this hook must be called synchronously in your
 * event handler. If your handler executes asynchronous code, call the
 * function in your handler before you invoke any async code. If you need to
 * prevent the synchronous execution from logging Promoted actions, call
 * `setActionState({ actionType: null })`.
 *
 * @returns setter function for `actionType` and `name`
 */
export function useCollectionActionState() {
  const context = React.useContext(CollectionTrackerContext)
  return {
    setActionState: ({
      actionType,
      name = '',
    }: CollectionActionState) => {
      context.setActionState({ actionType, name })
    }
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
 *         data={this.data}
 *         renderItem={this.renderItem}
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
 * ### Accessory Views and Other Action Types
 *
 * In class components, the `renderItem` function of your component will
 * be called with an additional parameter named `setActionState` of type
 * `(CollectionActionState) => void`. Use that parameter to set different
 * action types and names in class components.
 * For example:
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
 *   private renderItem = ({ item, setActionState }) => {
 *     return (
 *       <MyListItem data={item}>
 *         <LikeButton onClick={() => {
 *           // This causes Promoted to log a Like instead of a Navigate.
 *           setActionState({ actionType: ActionType.Like })
 *           this.handleLikeButton({ item, setActionState })
 *         }} />
 *       </MyListItem>
 *     )
 *   }
 * }
 * ```
 * If your list items in a functional component contain accessory views
 * that perform different actions, see `useCollectionActionState()`.
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
export function CollectionTracker<
  P extends CollectionTrackerProps
>({
  contentCreator,
  sourceType = ImpressionSourceType.Unknown,
} : CollectionTrackerArgs) {
  return (Component: React.ComponentType<P>) => {
    const collectionId = uuidv4()

    const CollectionTrackerComponent = ({
      onViewableItemsChanged,
      renderItem,
      viewabilityConfig,
      viewabilityConfigCallbackPairs,
      ...rest
    } : P) : React.ReactElement => {
      const {
        _viewabilityConfig,
        _onViewableItemsChanged,
      } = useImpressionTracker({
        contentCreator: ({ item }) => contentCreator(item),
        collectionId,
        sourceType,
      })

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

      // Set up a state in which accessory view event handlers can
      // set action type and name.
      const [actionState, setActionState] = React.useState({
        actionType: ActionType.Unknown,
        name: '',
      } as CollectionActionState)
      const autoViewStateRef = useAutoViewState()

      // Wrap the rendered item with a TapGestureHandler. This handler
      // will receive events even if child components consume it.
      const _renderItem = ({ item, ...rest }) => {
        const _onTapForItem = (item) => (event) => {
          // State machine will always give BEGAN and END on taps and
          // drags. For drags, it will be only BEGAN -> END.
          // ACTIVE only happens when it's an actual tap. When there's
          // an accessory event handler, it gets called before ACTIVE:
          // BEGAN -> (accessory event handler) -> ACTIVE -> END.
          // Any action state set by accessory event handlers must be
          // in place before the ACTIVE state.
          switch (event.nativeEvent.state) {
          case State.BEGAN:
            // Clear any context from previous event.
            // Default to Navigate action if this ends up being a tap.
            setActionState({
              actionType: ActionType.Navigate,
              name: null,
            })
            break
          case State.ACTIVE:
            // If an accessory event handler has set `actionType` to
            // `null`, do not log.
            if (actionState.actionType) {
              PromotedMetrics.collectionActionDidOccur({
                actionName: actionState.name ?? '',
                actionType: actionState.actionType,
                autoViewId: autoViewStateRef.current.autoViewId,
                content: contentCreator(item),
                collectionId,
              })
            }
            break
          }
        }
        return (
          <TapGestureHandler
            onGestureEvent={_onTapForItem(item)}
            onHandlerStateChange={_onTapForItem(item)}
          >
            <View>
              {renderItem({ item, setActionState, ...rest })}
            </View>
          </TapGestureHandler>
        )
      }

      return (
        <CollectionTrackerContext.Provider
          value={{setActionState: args => { setActionState(args) }}}
        >
          <Component
            renderItem={_renderItem}
            {...viewabilityArgs}
            {...rest}
          />
        </CollectionTrackerContext.Provider>
      )
    }

    CollectionTrackerComponent.displayName = `CollectionTracker(${
      Component.displayName || Component.name
    })`

    return CollectionTrackerComponent
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
  sourceType = ImpressionSourceType.Unknown,
} : CollectionTrackerArgs) {
  return (Component: React.ComponentType<P>) => {
    return React.useCallback(
      CollectionTracker({ contentCreator, sourceType })(Component),
      []
    )
  }
}
