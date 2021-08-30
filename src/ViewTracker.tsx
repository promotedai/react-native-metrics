import * as React from 'react'
import { NativeModules } from 'react-native'
import { NavigationContext, NavigationInjectedProps, withNavigation } from '@react-navigation/core'
import { v4 as uuidv4 } from 'uuid'

export type AutoViewState = {

  /** navigation.state.routeName */
  routeName: string

  /** navigation.state.key */
  routeKey: string

  /** UUID of view, for use as primary key in event. */
  autoViewId: string
}

const AutoViewContext = React.createContext({
  routeName: '',
  routeKey: '',
  autoViewId: '',
} as AutoViewState)

/**
 * Most recently logged view state.
 * Prevents us from logging same view twice in a row.
 */
var currentAutoViewState: AutoViewState = {
  routeName: '',
  routeKey: '',
  autoViewId: '',
}

export interface AutoViewTrackerInjectedProps extends NavigationInjectedProps {
  autoViewState: AutoViewState
}

export interface AutoViewTrackerArgs {

}

/**
 *
 * @returns
 */
// export function useAutoViewTracker() {
//   const navigation = React.useContext(NavigationContext)
//   const routeName = navigation.state.routeName
//   const routeKey = navigation.state.key
//   return () => {
//     if (currentAutoViewState.routeKey == routeKey) return
//     console.log("***** logView", routeName, routeKey, uuidv4())
//   }
// }

export function useAutoViewState() {
  const autoViewState = React.useContext(AutoViewContext)
}

/**
 * Wraps a component so that the result will automatically log views on
 * navigation 'focus' events. Typically, you would use this on pages or
 * components that contain controls that you wish to track manually.
 *
 * If you use `withCollectionTracker()` or `withMetricsLogger()`, the wrapped
 * component from those already use `withAutoViewTracker()`, so don't use
 * this function in conjunction with those.
 *
 * Usage:
 * ```
 * const MyComponent: FunctionComponent<MyProps> = (props) => {
 *   return withAutoViewTracker(
 *     <Component>{props.children}</Component>
 *   )
 * }
 * ```
 * Alternately you can use this with a class component:
 * ```
 * class MyComponent extends PureComponent<...> {
 *   // ...
 * }
 *
 * export default withAutoViewTracker(MyComponent)
 * ```
 *
 *
 * @returns  Wrapped component that will automatically log views
 */
export function withAutoViewTracker<
  P extends Partial<NavigationInjectedProps>
>({

} : AutoViewTrackerArgs) {
  return (Component: React.ComponentType<P>) => {

    const AutoViewTrackerComponent = ({
      navigation,
      ...rest
    } : P) : React.ReactElement => {
      //const autoViewState = React.useContext(AutoViewContext)

      React.useEffect(() => {
        if (navigation === undefined) {
          return
        }
        const routeName = navigation.state.routeName
        const routeKey = navigation.state.key
        navigation.addListener('focus', () => {

        })
        navigation.addListener('blur', () => {

        })

        // if (navigation.state !== undefined) {
        //   setAssociatedView({
        //     routeName: navigation.state.routeName,
        //     routeKey: navigation.state.key,
        //   })
        // }
      }, [])

      return (
        <AutoViewContext.Provider
          value={{
            routeName: navigation.state.routeName,
            routeKey: navigation.state.key,
            autoViewId: 'TODO',
          }}
        >
          <Component
            navigation={navigation}
            associatedView={associatedView}
            {...rest}
          />
        </AutoViewContext.Provider>
      )
    }

    AutoViewTrackerComponent.displayName = `AutoViewTracker(${
      Component.displayName || Component.name
    })`

    return withNavigation(AutoViewTrackerComponent)
  }
}
