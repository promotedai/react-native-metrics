import * as React from 'react'
import { NativeModules } from 'react-native'
import type { ViewToken } from 'react-native'

import type { Content } from './Content'
import { ImpressionSourceType } from './ImpressionSourceType'
import { useAutoViewState } from './ViewTracker'

const { PromotedMetrics } = NativeModules

/** Default viewability params for impression logging. */
export const promotedViewabilityConfig = {
  waitForInteraction: false,
  minimumViewTime: 1000,
  itemVisiblePercentThreshold: 50
}

export interface UseImpressionTrackerArgs {
  /** Function to map list items to Promoted Content. */
  contentCreator: (viewToken: ViewToken) => Content
  /** UUID for tracked collection. */
  collectionId: string
  /** Source of presented list content. Default: ClientBackend. */
  sourceType: ImpressionSourceType
}

/**
 * Returns handlers for use with onViewableItemsChanged and
 * viewabilityConfig for FlatLists and SectionLists.
 */
export const useImpressionTracker = ({
  contentCreator,
  collectionId,
  sourceType = ImpressionSourceType.Unknown,
} : UseImpressionTrackerArgs) => {

  const _viewabilityConfig = promotedViewabilityConfig
  const autoViewStateRef = useAutoViewState()
  const _onViewableItemsChanged = React.useCallback(
    ({viewableItems}) => {
      const contentList = viewableItems.map(contentCreator)
      PromotedMetrics.collectionDidChange({
        autoViewId: autoViewStateRef.current.autoViewId,
        collectionId,
        visibleContent: contentList,
      })
    },
    [],
  )

  React.useEffect(
    () => {
      PromotedMetrics.collectionDidMount({
        autoViewId: autoViewStateRef.current.autoViewId,
        collectionId,
        sourceType,
      })
      return () => {
        PromotedMetrics.collectionWillUnmount({
          autoViewId: autoViewStateRef.current.autoViewId,
          collectionId,
        })
      }
    },
    [],
  )

  return { _viewabilityConfig, _onViewableItemsChanged }
}
