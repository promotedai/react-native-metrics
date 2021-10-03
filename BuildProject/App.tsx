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
    const content = { _id: 'foobar'}

    PromotedMetrics.logImpression({})
    recordTestPassed('logImpression')

    PromotedMetrics.logAction({})
    recordTestPassed('logAction')

    PromotedMetrics.logView({})
    recordTestPassed('logView')

    PromotedMetrics.logAutoView({})
    recordTestPassed('logAutoView')
  }

  const testCollectionView = (recordTestPassed) => {
    const content = { _id: 'foobar'}

    PromotedMetrics.collectionDidMount({})
    recordTestPassed('collectionViewDidMount')

    PromotedMetrics.collectionDidChange({})
    recordTestPassed('collectionViewDidChange')

    PromotedMetrics.collectionActionDidOccur({})
    recordTestPassed('collectionViewActionDidOccur')

    PromotedMetrics.collectionWillUnmount({})
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
