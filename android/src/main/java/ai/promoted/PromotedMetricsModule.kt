package ai.promoted

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class PromotedMetricsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return "PromotedMetrics"
  }

  @ReactMethod
  fun startSessionAndLogUser(userID: String) {}

  @ReactMethod
  fun startSessionAndLogSignedOutUser() {}
  
  @ReactMethod
  fun logImpression(content: Map<String, Any>) {}
  
  @ReactMethod
  fun logClickToLike(content: Map<String, Any>, didLike: Boolean) {}
  
  @ReactMethod
  fun logClickToShow(screenName: String) {}
  
  @ReactMethod
  fun logClickToShow(screenName: String, content: Map<String, Any>) {}
  
  @ReactMethod
  fun logClickToSignUp(userId: String) {}
  
  @ReactMethod
  fun logClickToPurchase(item: Map<String, Any>) {}
  
  @ReactMethod
  fun logAction(name: String) {}
  
  @ReactMethod
  fun logActionWithContent(name: String, content: Map<String, Any>) {}
  
  @ReactMethod
  fun logView(screenName: String) {}
  
  @ReactMethod
  fun collectionViewDidLoad(collectionViewName: String) {}
  
  @ReactMethod
  fun collectionViewDidChange(visibleContent: Array<Map<String,Any>>, 
                              collectionViewName: String) {}

  @ReactMethod
  fun collectionViewDidUnmount(collectionViewName: String) {}
}
