import { useCallback, useEffect } from 'react'
import { NativeModules } from 'react-native'
import type { ViewToken } from 'react-native'

import type { Content } from './Content'
import { ImpressionSourceType } from './ImpressionSourceType'

const { PromotedMetrics } = NativeModules

/** Default viewability params for impression logging. */
export const promotedViewabilityConfig = {
  waitForInteraction: false,
  minimumViewTime: 1000,
  itemVisiblePercentThreshold: 50
}

/**
 * Returns handlers for use with onViewableItemsChanged and
 * viewabilityConfig for FlatLists and SectionLists.
 */
export const useImpressionTracker = (
  contentCreator: (viewToken: ViewToken) => Content,
  id: string,
  sourceType: ImpressionSourceType = ImpressionSourceType.Unknown
) => {

  const _viewabilityConfig = promotedViewabilityConfig

  const _onViewableItemsChanged = useCallback(({viewableItems}) => {
    const contentList = viewableItems.map(contentCreator)
    PromotedMetrics.collectionDidChange(contentList, id)
  }, [])

  useEffect(() => {
    PromotedMetrics.collectionDidMount(id, sourceType)
    return () => {
      PromotedMetrics.collectionWillUnmount(id)
    }
  }, [])

  return { _viewabilityConfig, _onViewableItemsChanged }
}
