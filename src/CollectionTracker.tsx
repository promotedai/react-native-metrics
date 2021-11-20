import * as React from 'react'
import { NativeModules, View } from 'react-native'
import uuid from 'react-native-uuid'

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
  forwardedRef?: React.Ref<any>
  onViewableItemsChanged?: (args: any) => void
  renderItem: (args: any) => any
  viewabilityConfig?: any
  viewabilityConfigCallbackPairs?: Array<any>
}

/** Arguments to configure CollectionTracker. */
export interface CollectionTrackerArgs {
  /** Function to map list items to Promoted Content. */
  contentCreator: (item: any) => Content

  /** Source of presented list content. Default: ClientBackend. */
  sourceType: ImpressionSourceType
}

/** Arguments for function returned by `useCollectionActionLogger()`. */
export interface CollectionActionState {
  actionType?: ActionType
  name?: string | null
}

/** React.Context used to send the action logger function to children. */
const CollectionTrackerContext = React.createContext({
  // @ts-ignore (TS6133: state declared but not used)
  logCollectionAction: (state?: CollectionActionState) => {},
})

/**
 * Use the function returned from this hook to log actions with a
 * tracked collection. The content for the action is determined using
 * the `data` property of the list.
 *
 * The type of action defaults to `ActionType.Navigate` if you call this
 * function with no arguments. The name is optional for all action types
 * except Custom. If you provide ActionType.Custom, you must provide a
 * name for the action.
 *
 * Class components using CollectionTracker will pass a function named
 * `logCollectionAction` as a parameter to `renderItem`. You can use that
 * function to log actions. See `CollectionTracker`.
 *
 * # Usage
 *
 * ## Functional Components
 *
 * Use this to log actions when users interact with items in your
 * collection.
 *
 * Suppose you have a collection of items that behaves as follows:
 * - Selecting an item shows a detail view. When selecting an item in
 *   this way, Promoted should log an action with `ActionType.Navigate`.
 * - Each item has a "Like" button. Tapping on this button should
 *   log `ActionType.Like`.
 * - Each item also has a "More Like This" button. Tapping on this
 *   button should log `ActionType.Custom` with name `MoreLikeThis`.
 * In your `renderItem` function, add the following to your handlers:
 * ```
 * const renderItem = ({ item }) => {
 *   const { logCollectionAction } = useCollectionActionLogger()
 *   const likeButtonHandler = () => {
 *     // Report this tap is ActionType.Like to Promoted.
 *     // The rest of the details are automatically filled in.
 *     logCollectionAction({
 *       actionType: ActionType.Like
 *     })
 *     likeItem(item)
 *   }
 *   const moreLikeThisButtonHandler = () => {
 *     // Report a custom action to Promoted.
 *     logCollectionAction({
 *       actionType: ActionType.Custom,
 *       name: 'MoreLikeThis'
 *     })
 *     showMoreLikeThis(item)
 *   }
 *   const showButtonHandler = () => {
 *     // Log ActionType.Navigate when user taps an item
 *     // in your list.
 *     logCollectionAction({
 *       actionType: ActionType.Navigate
 *     })
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
 * the above example. If you don't call this function, Promoted does not
 * log any actions.
 *
 * ## Class Components
 *
 * See `CollectionTracker` for details on collection action logging with
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
 * function in your handler before you invoke any async code.
 *
 * @returns action logging function
 */
export function useCollectionActionLogger() {
  const context = React.useContext(CollectionTrackerContext)
  return {
    logCollectionAction: (args: CollectionActionState = {
      actionType: ActionType.Navigate,
      name: null,
    }) => {
      context.logCollectionAction(args)
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
 *
 * In your event handlers for list items, use `logCollectionAction` to
 * log user actions. See `useCollectionActionLogger()`.
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
 * `View` with tap handlers to surround the component that you render.
 * This* handler listens for tap events and records the content in the
 * selected list item. This ensures that content is consistent between
 * impressions and actions. The content for these actions is derived by
 * applying `contentCreator` to the argument of `renderItem`.
 *
 * This handler does not consume the tap event or alter the existing
 * behavior of your rendered items in any other way.
 *
 * ### Accessory Views and Other Action Types
 *
 * In class components, the `renderItem` function of your component will
 * be called with an additional parameter named `logCollectionAction` of
 *  type `(CollectionActionState) => void`. Use that parameter to log
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
 *   private renderItem = ({ item, logCollectionAction }) => {
 *     return (
 *       <MyListItem
 *         data={item}
 *         onPress={() => {
 *           logCollectionAction()  // Defaults to ActionType.Navigate
 *           this.handleListSelection({ item })
 *         }}
 *       >
 *         <LikeButton onClick={() => {
 *           // This causes Promoted to log a Like.
 *           logCollectionAction({ actionType: ActionType.Like })
 *           this.handleLikeButton({ item, logCollectionAction })
 *         }} />
 *       </MyListItem>
 *     )
 *   }
 * }
 * ```
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
 * @returns wrapped component to use as list component
 */
export function CollectionTracker<
  P extends CollectionTrackerProps
>({
  contentCreator,
  sourceType = ImpressionSourceType.Unknown,
} : CollectionTrackerArgs) {
  return (Component: React.ComponentType<P>) => {
    const CollectionTrackerComponent = ({
      forwardedRef,
      onViewableItemsChanged,
      renderItem,
      viewabilityConfig,
      viewabilityConfigCallbackPairs,
      ...rest
    } : P) : React.ReactElement => {

      const collectionId = React.useRef(uuid.v4())

      const {
        _viewabilityConfig,
        _onViewableItemsChanged,
      } = useImpressionTracker({
        contentCreator: ({ item }) => contentCreator(item),
        collectionId: collectionId.current,
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

      // Callback to log actions associated with this collection.
      const autoViewStateRef = useAutoViewState()
      const itemRef = React.useRef({})
      const logCollectionAction = React.useCallback((
        args: CollectionActionState = {
          actionType: ActionType.Navigate,
          name: null,
        }
      ) => {
        const {
          name,
          actionType,
        } = args
        const {
          autoViewId,
          hasSuperimposedViews,
        } = autoViewStateRef.current
        PromotedMetrics.collectionActionDidOccur({
          actionName: name ?? '',
          actionType,
          autoViewId,
          content: contentCreator(itemRef.current),
          collectionId: collectionId.current,
          hasSuperimposedViews,
        })
      }, [])

      // Wrap the rendered item with a View that captures a reference
      // to the rendered content. This ensures that action logging uses
      // content consistent with impression logging.
      const _renderItem = ({ item, ...rest }) => {
        const touchStartHandler = () => {
          itemRef.current = item
        }
        const touchEndHandler = () => {
          itemRef.current = {}
        }
        return (
          <View
            onTouchStart={touchStartHandler}
            onTouchEnd={touchEndHandler}
            pointerEvents={'box-none'}
          >
            {renderItem({ item, logCollectionAction, ...rest })}
          </View>
        )
      }

      return (
        <CollectionTrackerContext.Provider
          value={{logCollectionAction: args => {logCollectionAction(args)}}}
        >
          <Component
            ref={forwardedRef}
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

    return React.forwardRef((props, ref) => (
      <CollectionTrackerComponent forwardedRef={ref} {...props}/>
    ))
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
 * @returns wrapped component to use as list component
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
