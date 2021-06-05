/**
 * Promoted React Native Metrics testing app.
 *
 * @format
 * @flow strict-local
 */

import PromotedMetrics, { ActionType } from '@promotedai/react-native-metrics';
import React, { useState } from 'react';
import type { Node } from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  useColorScheme,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [text, setText] = useState('');

  const handleTestAll = () => {
    const content = { _id: "foobar"};
    var allMessages = '';
    const logPassed = (message) => {
      allMessages += 'Passed: ' + message + '\n';
    };

    PromotedMetrics.startSessionAndLogUser("foobar");
    logPassed('startSessionAndLogUser');

    PromotedMetrics.startSessionAndLogSignedOutUser();
    logPassed('startSessionAndLogSignedOutUser');

    PromotedMetrics.logImpression(content);
    logPassed('logImpression');

    PromotedMetrics.logViewReady("foobar", "batman");
    logPassed('logViewReady');

    PromotedMetrics.logViewChange("spaghetti", "meatballs");
    logPassed('logViewChange');

    PromotedMetrics.collectionViewDidLoad("hello");
    logPassed('collectionViewDidLoad');

    PromotedMetrics.collectionViewDidChange([], "hello");
    logPassed('collectionViewDidChange');

    PromotedMetrics.collectionViewDidUnmount("hello");
    logPassed('collectionViewDidUnmount');

    PromotedMetrics.getCurrentOrPendingAncestorIds();
    logPassed('getCurrentOrPendingAncestorIds');

    PromotedMetrics.logNavigateAction("screen");
    logPassed('logNavigateAction');

    PromotedMetrics.logNavigateActionWithContent("screen", content);
    logPassed('logNavigateActionWithContent');

    PromotedMetrics.logAddToCartAction(content);
    logPassed('logAddToCartAction');

    PromotedMetrics.logRemoveFromCartAction(content);
    logPassed('logRemoveFromCartAction');

    PromotedMetrics.logCheckoutAction();
    logPassed('logCheckoutAction');

    PromotedMetrics.logPurchaseAction(content);
    logPassed('logPurchaseAction');

    PromotedMetrics.logShareAction(content);
    logPassed('logShareAction');

    PromotedMetrics.logLikeAction(content);
    logPassed('logLikeAction');

    PromotedMetrics.logUnlikeAction(content);
    logPassed('logUnlikeAction');

    PromotedMetrics.logCommentAction(content);
    logPassed('logCommentAction');

    PromotedMetrics.logMakeOfferAction(content);
    logPassed('logMakeOfferAction');

    PromotedMetrics.logAskQuestionAction(content);
    logPassed('logAskQuestionAction');

    PromotedMetrics.logAnswerQuestionAction(content);
    logPassed('logAnswerQuestionAction');

    PromotedMetrics.logCompleteSignInAction();
    logPassed('logCompleteSignInAction');

    PromotedMetrics.logCompleteSignUpAction();
    logPassed('logCompleteSignUpAction');

    PromotedMetrics.logAction("custom");
    logPassed('logAction');

    PromotedMetrics.logActionWithType("custom", ActionType.Navigate);
    logPassed('logActionWithType');

    PromotedMetrics.logActionWithContent("custom", ActionType.Share, content);
    logPassed('logActionWithContent');

    setText(allMessages);
    Alert.alert("Passed", "All logging passed.");
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Button
          title="Test All"
          onPress={handleTestAll}/>
        <Text>{text}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
