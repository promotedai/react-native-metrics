package ai.promoted

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.Promise

class PromotedMetricsModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return "PromotedMetrics"
  }

  @ReactMethod @Suppress("UNUSED_PARAMETER")
  fun startSessionAndLogUser(userId: String) {}

  @ReactMethod
  fun startSessionAndLogSignedOutUser() {}
  
  @ReactMethod @Suppress("UNUSED_PARAMETER")
  fun logImpression(content: ReadableMap) {}
  
  @ReactMethod @Suppress("UNUSED_PARAMETER")
  fun logClickToLike(content: ReadableMap, didLike: Boolean) {}
  
  @ReactMethod @Suppress("UNUSED_PARAMETER")
  fun logClickToShow(screenName: String) {}
  
  @ReactMethod @Suppress("UNUSED_PARAMETER")
  fun logClickToShow(screenName: String, content: ReadableMap) {}
  
  @ReactMethod @Suppress("UNUSED_PARAMETER")
  fun logClickToSignUp(userId: String) {}
  
  @ReactMethod @Suppress("UNUSED_PARAMETER")
  fun logClickToPurchase(item: ReadableMap) {}
  
  @ReactMethod @Suppress("UNUSED_PARAMETER")
  fun logAction(name: String) {}
  
  @ReactMethod @Suppress("UNUSED_PARAMETER")
  fun logActionWithContent(name: String, content: ReadableMap) {}
  
  @ReactMethod @Suppress("UNUSED_PARAMETER")
  fun logView(screenName: String) {}
  
  @ReactMethod @Suppress("UNUSED_PARAMETER")
  fun collectionViewDidLoad(collectionViewName: String) {}
  
  @ReactMethod @Suppress("UNUSED_PARAMETER")
  fun collectionViewDidChange(visibleContent: ReadableArray,
                              collectionViewName: String) {}

  @ReactMethod @Suppress("UNUSED_PARAMETER")
  fun collectionViewDidUnmount(collectionViewName: String) {}
}
