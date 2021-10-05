// If the client isn't using React Navigation v5, then the
// useNavigation/useFocusEffect hooks could be in
// react-navigation-hooks.
// Since @r-n/core is listed as a dependency in package.json,
// it's fine to have this outer require() without a try/catch.
let useNavigation = require('@react-navigation/core').useNavigation
let useFocusEffect = require('@react-navigation/core').useFocusEffect
let isReactNavigation5OrLater = true
if (useNavigation === undefined || useFocusEffect === undefined) {
  try {
    useNavigation = require('react-navigation-hooks').useNavigation
    useFocusEffect = require('react-navigation-hooks').useFocusEffect
    isReactNavigation5OrLater = false
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        'Import react-navigation-hooks not found. ' +
        'If you are using React Navigation <5.0.0, then ' +
        'you must also depend on react-navigation-hooks.'
      )
    }
  }
  if (
    (useNavigation === undefined || useFocusEffect === undefined) &&
    process.env.NODE_ENV !== 'production'
  ) {
    console.error(
      'Could not import useFocusEffect from either ' +
      '@react-navigation/core or react-navigation-hooks. ' +
      'View tracking will be disabled and Promoted ' +
      'integration may be degraded.'
    )
  }
}

import * as React from 'react'
import { NativeModules } from 'react-native'
import uuid from 'react-native-uuid'

import LRUCache from './LRUCache'
import type { PromotedMetricsType } from './PromotedMetricsType'

const { PromotedMetrics } = NativeModules
const P = PromotedMetrics as PromotedMetricsType

/** View tracking state. */
export type AutoViewState = {

  /** navigation.state.routeName */
  routeName: string

  /** navigation.state.key */
  routeKey: string

  /** UUID of view, for use as primary key in event. */
  autoViewId: string

  /** Whether this view may not be topmost. */
  hasSuperimposedViews: boolean
}

/**
 * Most recently logged view state.
 * Prevents us from logging same view twice in a row.
 */
var mostRecentlyLoggedAutoViewState: AutoViewState = {
  routeName: '',
  routeKey: '',
  autoViewId: '',
  hasSuperimposedViews: false,
}

/**
 * Mapping of recent routeKeys to autoViewId.
 * If a component is mounted in the background, then it won't ever
 * get focus, so it won't receive an autoViewId. This allows us to
 * re-use the most recent id for that routeKey.
 */
var routeKeyToAutoViewId = new LRUCache()

function getStateReactNavigation5OrLater(navigation) {
  const state = navigation.getState()
  const route = state.routes[state.index]
  return {
    routeName: route.name,
    routeKey: route.key,
  }
}

function getStateReactNavigation4OrEarlier(navigation) {
  return {
    routeName: navigation.state.routeName,
    routeKey: navigation.state.key,
  }
}

/**
 * Creates a reference to an `AutoViewState` and automatically logs a
 * Promoted view when it receives navigation focus. The reference will
 * always contain an updated `autoViewId` for the AutoView.
 * There must be a `NavigationContext` available for this to succeed.
 *
 * In order to properly enable automatic view logging, some path
 * needs to go through this method to install the hook. As of this
 * writing, there are 3 ways to do this:
 *
 * 1. Use one of `useCollectionTracker()` or `withCollectionTracker()`.
 *    The wrapped Component will automatically log a view when it gains
 *    navigation focus.
 * 2. Use the `useMetricsLogger()` hook. This installs another hook that
 *    will automatically log a view when the current functional component
 *    gains focus.
 * 3. Use `withMetricsLogger()` with some component. This component will
 *    then automatically log a view when it gains focus.
 *
 * You can mix and match these approaches in your Components. For example,
 * you can place CollectionTracker inside a Component wrapped with
 * `withMetricsLogger()` and automatic view logging will still work properly.
 *
 * If you can't do any of these at the point of logging, please talk to the
 * mobile team at Promoted. Some things we might suggest:
 *
 * 1. If there's a parent component, then install one of the hooks there
 *    to make it automatically log a view. This is less desirable because
 *    it separates the view and action logging, but it works.
 * 2. Log the view manually. You can call `MetricsLogger.logView` to cause
 *    a view to be unconditionally logged. This may not produce the most
 *    accurate tracking, so use with caution.
 * 3. Install handlers on a `NavigationContainer` to log when the route
 *    changes. This is also less desirable because it will log *every*
 *    view change that occurs within, not just relevant ones.
 *
 * @returns Reference to `AutoViewState`
 */
export function useAutoViewState() {
  const navigation = useNavigation()
  const { routeName, routeKey } = (
    isReactNavigation5OrLater ?
    getStateReactNavigation5OrLater(navigation) :
    getStateReactNavigation4OrEarlier(navigation)
  )
  const autoViewStateRef = React.useRef({
    routeName,
    routeKey,
    autoViewId: routeKeyToAutoViewId.get(routeKey),
    hasSuperimposedViews: true,
  } as AutoViewState)

  useFocusEffect(
    React.useCallback(
      () => {
        // We just received focus, so we must be topmost.
        autoViewStateRef.current = {
          ...autoViewStateRef.current,
          hasSuperimposedViews: false,
        }

        // If view is already most recently logged, don't log it again.
        // Read its state into ours so that we use the same autoViewId
        // as any existing state.
        // This is so that if you have multiple instances of
        // useAutoViewState() (such as multiple MetricsLoggers or
        // CollectionTrackers) in the same view, we don't end logging
        // each of them with a different autoViewId.
        // Instead, only the first one of these callbacks generates
        // and logs the autoViewId, and the rest of them copy the
        // autoViweId from that callback. It doesn't matter which order
        // the callbacks are invoked by React Native.
        if (
          mostRecentlyLoggedAutoViewState.routeKey ==
            autoViewStateRef.current.routeKey
        ) {
          autoViewStateRef.current = mostRecentlyLoggedAutoViewState
          return () => {
            // When focus is lost, set hasSuperimposedViews.
            autoViewStateRef.current = {
              ...autoViewStateRef.current,
              hasSuperimposedViews: true,
            }
          }
        }

        // Generate a new autoViewId.
        const updatedAutoViewState = {
          ...autoViewStateRef.current,
          autoViewId: uuid.v4(),
        }
        // Set state for this context.
        autoViewStateRef.current = updatedAutoViewState
        // Log this view as being topmost.
        P.logAutoView(updatedAutoViewState)
        // Set state globally for most recent logged view.
        mostRecentlyLoggedAutoViewState = updatedAutoViewState
        routeKeyToAutoViewId.set(
          updatedAutoViewState.routeKey,
          updatedAutoViewState.autoViewId
        )
        return () => {
          // When focus is lost, set hasSuperimposedViews.
          autoViewStateRef.current = {
            ...autoViewStateRef.current,
            hasSuperimposedViews: true,
          }
        }
      },
      []
    )
  )

  return autoViewStateRef
}

/**
 * Wraps a Component with `AutoViewState` so that it will automatically
 * log a Promoted view when it receives navigation focus.
 */
export function withAutoViewState<P>(
  Component: React.ComponentType<P>
) {
  const AutoViewStateComponent = ({
    ...rest
  }) : React.ReactElement => {
    const autoViewStateRef = useAutoViewState()
    return (
      <Component
        autoViewStateRef={autoViewStateRef}
        {...rest}
      />
    )
  }
  return AutoViewStateComponent
}
