import PromotedMetrics from ".";
import { useCallback, useEffect } from "react";
import type { ViewToken } from "react/ViewabilityHelper";

/**
 * Returns handlers for use with onViewableItemsChanged and
 * viewabilityConfig for FlatLists and SectionLists.
 */
export const useImpressionLogger = (
    collectionViewName: string,
    contentCreator: (viewToken: ViewToken) => Object) => {

  const _viewabilityConfig = {
    waitForInteraction: false,
    minimumViewTime: 1000,
    itemVisiblePercentThreshold: 50
  }

  const _onViewableItemsChanged = useCallback(
    ({viewableItems, changed}) => {
      const contentList = viewableItems.map(contentCreator);
      PromotedMetrics.collectionViewDidChange(contentList, collectionViewName);
    }, []);

  useEffect(() => {
    PromotedMetrics.collectionViewDidLoad(collectionViewName);
  }, []);

  useEffect(() => {
    return () => {
      PromotedMetrics.collectionViewDidUnmount(collectionViewName);
    }
  }, []);

  return { _viewabilityConfig, _onViewableItemsChanged }
};
