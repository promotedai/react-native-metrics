/**
 * Promoted React Native Metrics testing app.
 *
 * @format
 * @flow strict-local
 */

import PromotedMetrics from '@promotedai/react-native-metrics';
import type { ActionType } from '@promotedai/react-native-metrics';
import React from 'react';
import type { Node } from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Button 
          title="Test All" 
          onPress={() => {
            const content = { _id: "foobar"};
            PromotedMetrics.startSessionAndLogUser("foobar");
            PromotedMetrics.startSessionAndLogSignedOutUser();
            PromotedMetrics.logImpression(content);
            PromotedMetrics.logViewReady("foobar", "batman");
            PromotedMetrics.logViewChange("spaghetti", "meatballs");
            PromotedMetrics.collectionViewDidLoad("hello");
            PromotedMetrics.collectionViewDidChange([], "hello");
            PromotedMetrics.collectionViewDidUnmount("hello");
            PromotedMetrics.getLoggingSessionInfo();
            PromotedMetrics.logNavigateAction("screen");
            PromotedMetrics.logNavigateActionWithContent("screen", content);
            PromotedMetrics.logAddToCartAction(content);
            PromotedMetrics.logRemoveFromCartAction(content);
            PromotedMetrics.logCheckoutAction();
            PromotedMetrics.logPurchaseAction(content);
            PromotedMetrics.logShareAction(content);
            PromotedMetrics.logLikeAction(content);
            PromotedMetrics.logUnlikeAction(content);
            PromotedMetrics.logCommentAction(content);
            PromotedMetrics.logMakeOfferAction(content);
            PromotedMetrics.logAskQuestionAction(content);
            PromotedMetrics.logAnswerQuestionAction(content);
            //PromotedMetrics.logCompleteSignInAction();
            //PromotedMetrics.logCompleteSignUpAction();
            PromotedMetrics.logAction("custom");
            PromotedMetrics.logActionWithType("custom", ActionType.Navigate);
            PromotedMetrics.logActionWithContent("custom", ActionType.Share, content);
            Alert.alert("Passed", "All logging passed.");
          }}/>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
