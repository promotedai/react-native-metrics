import { useCallback, useEffect } from 'react'
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
  const autoViewState = useAutoViewState()
  const _onViewableItemsChanged = useCallback(({viewableItems}) => {
    const contentList = viewableItems.map(contentCreator)
    PromotedMetrics.collectionDidChange({
      contentList,
      collectionId,
      autoViewId: autoViewState.autoViewId,
    })
  }, [])

  useEffect(() => {
    PromotedMetrics.collectionDidMount(collectionId, sourceType)
    return () => {
      PromotedMetrics.collectionWillUnmount(collectionId)
    }
  }, [])

  return { _viewabilityConfig, _onViewableItemsChanged }
}
