/**
 * Promoted React Native Metrics testing app.
 *
 * @format
 * @flow strict-local
 */

import PromotedMetrics, { ActionType } from '@promotedai/react-native-metrics';
import type { AncestorIds } from '@promotedai/react-native-metrics';
import React, { useState } from 'react';
import type { Node } from 'react';
import {
  Button,
  SafeAreaView,
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

  const testStartSession = (recordTestPassed) => {
    PromotedMetrics.startSessionAndLogUser('foobar');
    recordTestPassed('startSessionAndLogUser');

    PromotedMetrics.startSessionAndLogSignedOutUser();
    recordTestPassed('startSessionAndLogSignedOutUser');
  }

  const testLogEvents = (recordTestPassed) => {
    const content = { _id: 'foobar'};

    PromotedMetrics.logImpression(content);
    recordTestPassed('logImpression');

    PromotedMetrics.logViewReady('foobar', 'batman');
    recordTestPassed('logViewReady');

    PromotedMetrics.logViewChange('spaghetti', 'meatballs');
    recordTestPassed('logViewChange');

    PromotedMetrics.logNavigateAction('screen');
    recordTestPassed('logNavigateAction');

    PromotedMetrics.logNavigateActionWithContent('screen', content);
    recordTestPassed('logNavigateActionWithContent');

    PromotedMetrics.logAddToCartAction(content);
    recordTestPassed('logAddToCartAction');

    PromotedMetrics.logRemoveFromCartAction(content);
    recordTestPassed('logRemoveFromCartAction');

    PromotedMetrics.logCheckoutAction();
    recordTestPassed('logCheckoutAction');

    PromotedMetrics.logPurchaseAction(content);
    recordTestPassed('logPurchaseAction');

    PromotedMetrics.logShareAction(content);
    recordTestPassed('logShareAction');

    PromotedMetrics.logLikeAction(content);
    recordTestPassed('logLikeAction');

    PromotedMetrics.logUnlikeAction(content);
    recordTestPassed('logUnlikeAction');

    PromotedMetrics.logCommentAction(content);
    recordTestPassed('logCommentAction');

    PromotedMetrics.logMakeOfferAction(content);
    recordTestPassed('logMakeOfferAction');

    PromotedMetrics.logAskQuestionAction(content);
    recordTestPassed('logAskQuestionAction');

    PromotedMetrics.logAnswerQuestionAction(content);
    recordTestPassed('logAnswerQuestionAction');

    PromotedMetrics.logCompleteSignInAction();
    recordTestPassed('logCompleteSignInAction');

    PromotedMetrics.logCompleteSignUpAction();
    recordTestPassed('logCompleteSignUpAction');

    PromotedMetrics.logAction('custom');
    recordTestPassed('logAction');

    PromotedMetrics.logActionWithType('custom', ActionType.Navigate);
    recordTestPassed('logActionWithType');

    PromotedMetrics.logActionWithContent('custom', ActionType.Share, content);
    recordTestPassed('logActionWithContent');
  }

  const testCollectionView = (recordTestPassed) => {
    PromotedMetrics.collectionViewDidMount('hello');
    recordTestPassed('collectionViewDidMount');

    PromotedMetrics.collectionViewDidChange([], 'hello');
    recordTestPassed('collectionViewDidChange');

    PromotedMetrics.collectionViewWillUnmount('hello');
    recordTestPassed('collectionViewWillUnmount');
  }

  const testAncestorIds = (recordTestPassed) => {
    PromotedMetrics.getCurrentOrPendingAncestorIds();
    recordTestPassed('getCurrentOrPendingAncestorIds');

    const ancestorIds = {
      logUserId: 'batman',
      sessionId: 'gotham',
      viewId: 'joker'
    } as AncestorIds;
    PromotedMetrics.setAncestorIds(ancestorIds);
    recordTestPassed('setAncestorIds');
  }

  const handleTestAll = () => {
    var allMessages = '';
    const recordTestPassed = (message) => {
      allMessages += 'Passed: ' + message + '\n';
    };

    try {
      testStartSession(recordTestPassed);
      testLogEvents(recordTestPassed);
      testCollectionView(recordTestPassed);
      testAncestorIds(recordTestPassed);
      allMessages += 'All logging passed';
      setText(allMessages);
    } catch (err) {
      setText(err.message);
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Button
        title='Test All'
        onPress={handleTestAll}
        testID='test-all-button'/>
      <Text testID='messages-text'>{text}</Text>
    </SafeAreaView>
  );
};

export default App;
