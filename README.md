# react-native-metrics

Promoted metrics logging library for React Native.

Currently released for iOS and stubbed out on Android. You can make `PromotedMetrics` calls directly in shared Typescript/Javascript without platform checks. These calls will log on iOS and do nothing on Android.

## Installation

Add `"@promotedai/react-native-metrics"` as a dependency in your `package.json` file.

## Usage

### Tracking sessions and events

Call `startSession*` or `log*` directly from your React Native code when these events occur.

~~~js
import PromotedMetrics from "@promotedai/react-native-metrics";

PromotedMetrics.startSessionAndLogUser(user.uid);
PromotedMetrics.logAction("Add to cart");
PromotedMetrics.logView("Sign up");
~~~

### Tracking impressions

Impression tracking is possible for any kind of content. Here is an example using `SectionList` or `FlatList` using `onViewableItemsChanged`.

~~~js
const _viewabilityConfig = {
  waitForInteraction: false,
  minimumViewTime: 1000,
  itemVisiblePercentThreshold: 50
}

const _onViewableItemsChanged = useCallback(
  ({viewableItems, changed}) => {
    const contentList = viewableItems.map(i => ({ 
      content_id: i.my_content_id,
      insertion_id: i.promoted_insertion_id,
      name: i.my_content_name
    }));
    PromotedMetrics.collectionViewDidChange(contentList, "MyListIdentifier");
  },
  []
);

const _onUnmount = useCallback(
  () => {
    PromotedMetrics.collectionViewDidUnmount("MyListIdentifier");
  },
  []
);

PromotedMetrics.collectionViewDidLoad("MyListIdentifier");

return (
  <FlatList
    onUnmount={_onUnmount}
    onViewableItemsChanged={_onViewableItemsChanged}
    viewabilityConfig={_viewabilityConfig}
    ...
  />
);
~~~

### Content objects

In many cases, the Typescript library expects `Object`s as arguments to represent content. For these content objects, the library expects the following keys:
1. (Required) `content_id`, `contentId`, or `_id` should contain a unique identifier for the content. This identifier can be anything from your system.
2. (Optional) `insertion_id`, or `insertionId` should contain the insertion ID as provided by Promoted for inserted content.
3. (Optional) `name` can contain a human-readable name for the content, and can be used for debugging purposes. This field is not sent to backends.

If your content objects contain additional data, we recommend filtering out all data except the above:

~~~js
const contentList = myViewableItems.map(i => ({ 
  content_id: i.my_content_id,
  insertion_id: i.promoted_insertion_id,
  name: i.my_content_name
}));
PromotedMetrics.collectionViewDidChange(contentList, "MyListIdentifier");
~~~
