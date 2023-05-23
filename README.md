# react-native-metrics

Promoted metrics logging library for React Native. Released for iOS and Android.

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
import PromotedMetrics, { useImpressionTracker } from "@promotedai/react-native-metrics";

const { _viewabilityConfig, _onViewableItemsChanged } = useImpressionTracker(
  "MyListIdentifier",
  (viewToken) => ({
      content_id: viewToken.item.my_content_id,
      insertion_id: viewToken.item.promoted_insertion_id,
      name: viewToken.item.my_content_name
  }));

return (
  <FlatList
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

# Internal

## Running tests

You'll need to:
```
cd BuildProject
export TEST_PLATFORM=android
export NODE_OPTIONS=--openssl-legacy-provider
npm run test
```
