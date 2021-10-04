import PromotedMetrics, { ActionType, ImpressionSourceType, useImpressionTracker, useViewTracker } from '@promotedai/react-native-metrics'
import type { AncestorIds } from '@promotedai/react-native-metrics'
import React, { useEffect, useRef, useState } from 'react'
import type { Node } from 'react'
import {
  Button,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  useColorScheme,
} from 'react-native'

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen'

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark'

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  }

  const [text, setText] = useState('')

  const handleTestAll = () => {
    var allMessages = text + '\n'
    const recordTestPassed = (message) => {
      allMessages += 'Passed: ' + message + '\n'
    }

    try {
      testStartSession(recordTestPassed)
      testLogEvents(recordTestPassed)
      testCollectionView(recordTestPassed)
      testAncestorIds(recordTestPassed)
      allMessages += 'All logging passed'
      setText(allMessages)
    } catch (err) {
      setText(err.message)
    }
  }

  const testStartSession = (recordTestPassed) => {
    PromotedMetrics.startSessionAndLogUser('foobar')
    recordTestPassed('startSessionAndLogUser')

    PromotedMetrics.startSessionAndLogSignedOutUser()
    recordTestPassed('startSessionAndLogSignedOutUser')
  }

  const testLogEvents = (recordTestPassed) => {
    const content = {
      contentId: 'foobar',
      insertionId: 'batman',
      name: 'Dick Greyson',
    }

    PromotedMetrics.logImpression({
      autoViewId: 'fake-auto-view-id',
      content,
      hasSuperimposedViews: false,
      sourceType: ImpressionSourceType.Delivery,
    })
    recordTestPassed('logImpression')

    PromotedMetrics.logAction({
      actionName: '',
      actionType: ActionType.Navigate,
      autoViewId: 'fake-auto-view-id',
      content,
      destinationScreenName: 'Fake Details Screen',
      hasSuperimposedViews: false,
    })
    recordTestPassed('logAction')

    PromotedMetrics.logView({
      routeKey: 'fake-route-key',
      routeName: 'Fake Route Name',
    })
    recordTestPassed('logView')

    PromotedMetrics.logAutoView({
      autoViewId: 'fake-auto-view-id',
      routeKey: 'route-key',
      routeName: 'Fake Route Name',
    })
    recordTestPassed('logAutoView')
  }

  const testCollectionView = (recordTestPassed) => {
    const content = {
      contentId: 'foobar',
      insertionId: 'batman',
      name: 'Dick Greyson',
    }

    PromotedMetrics.collectionDidMount({
      autoViewId: 'fake-auto-view-id',
      collectionId: 'fake-collection-id',
      sourceType: ImpressionSourceType.Delivery,
    })
    recordTestPassed('collectionViewDidMount')

    PromotedMetrics.collectionDidChange({
      autoViewId: 'fake-auto-view-id',
      collectionId: 'fake-collection-id',
      hasSuperimposedViews: false,
      visibleContent: [content],
    })
    recordTestPassed('collectionViewDidChange')

    PromotedMetrics.collectionActionDidOccur({
      actionName: '',
      actionType: ActionType.Navigate,
      autoViewId: 'fake-auto-view-id',
      collectionId: 'fake-collection-id',
      content,
      hasSuperimposedViews: false,
    })
    recordTestPassed('collectionViewActionDidOccur')

    PromotedMetrics.collectionWillUnmount({
      autoViewId: 'fake-auto-view-id',
      collectionId: 'fake-collection-id',
    })
    recordTestPassed('collectionViewWillUnmount')
  }

  const testAncestorIds = (recordTestPassed) => {
    PromotedMetrics.getCurrentOrPendingAncestorIds()
    recordTestPassed('getCurrentOrPendingAncestorIds')

    const ancestorIds = {
      logUserId: 'batman',
      sessionId: 'gotham',
      viewId: 'joker'
    } as AncestorIds
    PromotedMetrics.setAncestorIds(ancestorIds)
    recordTestPassed('setAncestorIds')
  }

  try {
    useImpressionTracker(
      (viewToken) => ({
        contentId: 'foo',
        insertionId: 'bar',
        name: 'batman'
      }),
      'TestCollectionViewName',
      ImpressionSourceType.Delivery
    )
    useViewTracker(useRef())
    useEffect(() => {
      setText('Passed: useImpressionTracker\n' +
              'Passed: useViewTracker\n' +
              'All hooks passed')
    }, [])
  } catch (err) {
    useEffect(() => {
      setText(err.message)
    }, [])
  }

  const testID = (id) => (
    Platform.OS === 'ios' ? {
      testID: id
    } : {
      accessibilityLabel: id
    }
  )

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Button
        onPress={handleTestAll}
        title='Test All'
        {...testID('test-all-button')}/>
      <Text {...testID('messages-text')}>
        {text}
      </Text>
    </SafeAreaView>
  )
}

export default App
