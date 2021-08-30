import { NavigationContext } from '@react-navigation/core'
import * as React from 'react'
import { NativeModules } from 'react-native'
import { v4 as uuidv4 } from 'uuid'
import type { PromotedMetricsType } from './PromotedMetricsType'

const { PromotedMetrics } = NativeModules
const P = PromotedMetrics as PromotedMetricsType

export type AutoViewState = {

  /** navigation.state.routeName */
  routeName: string

  /** navigation.state.key */
  routeKey: string

  /** UUID of view, for use as primary key in event. */
  autoViewId: string
}

/**
 * Most recently logged view state.
 * Prevents us from logging same view twice in a row.
 */
var currentAutoViewState: AutoViewState = {
  routeName: '',
  routeKey: '',
  autoViewId: '',
}

/**
 * Creates an updating `AutoViewState` tied to the active component.
 *
 * @returns Updating `AutoViewState` if available, `null` otherwise
 */
export function useAutoViewState() {
  const navigation = React.useContext(NavigationContext)
  const [autoViewState, setAutoViewState] = navigation !== undefined
    ? React.useState({
        routeName: navigation.state.routeName,
        routeKey: navigation.state.key,
        autoViewId: ''
      })
    : [null, null]

  React.useEffect(() => {
    if (navigation === undefined) {
      return () => {}
    }
    const removeListener = navigation.addListener('focus', () => {
      if (currentAutoViewState.routeKey != autoViewState.routeKey) {
        // Generates a new primary key for this.
        const updatedAutoViewState = {
          ...autoViewState,
          autoViewId: uuidv4(),
        }
        // Sets state for this context.
        setAutoViewState(updatedAutoViewState)
        // Logs this view as being topmost.
        P.logAutoView(updatedAutoViewState)
        // Sets state globally for most recent logged view.
        currentAutoViewState = updatedAutoViewState
      }
    })
    return () => { removeListener() }
  }, [navigation, autoViewState, setAutoViewState])

  return autoViewState
}


/**
 * Creates a scoped `MetricsLogger` tied to a given Component.
 */
 export function withAutoViewState<P>(
  Component: React.ComponentType<P>
) {
  const AutoViewStateComponent = ({
    ...rest
  }) : React.ReactElement => {
    const autoViewState = useAutoViewState()
    return (
      <Component
        autoViewState={autoViewState}
        {...rest}
      />
    )
  }
  return AutoViewStateComponent
}
