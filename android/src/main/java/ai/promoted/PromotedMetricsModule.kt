package ai.promoted

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableMap

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
  fun logNavigateAction(screenName: String) {}
  
  @ReactMethod @Suppress("UNUSED_PARAMETER")
  fun logNavigateActionWithContent(screenName: String, content: ReadableMap) {}
  
  @ReactMethod @Suppress("UNUSED_PARAMETER")
  fun logAddToCartAction(item: ReadableMap) {}
  
  @ReactMethod @Suppress("UNUSED_PARAMETER")
  fun logRemoveFromCartAction(item: ReadableMap) {}
  
  @ReactMethod
  fun logCheckoutAction() {}
  
  @ReactMethod @Suppress("UNUSED_PARAMETER")
  fun logPurchaseAction(item: ReadableMap) {}
  
  @ReactMethod @Suppress("UNUSED_PARAMETER")
  fun logShareAction(content: ReadableMap) {}
  
  @ReactMethod @Suppress("UNUSED_PARAMETER")
  fun logLikeAction(content: ReadableMap) {}
  
  @ReactMethod @Suppress("UNUSED_PARAMETER")
  fun logUnlikeAction(content: ReadableMap) {}
  
  @ReactMethod @Suppress("UNUSED_PARAMETER")
  fun logCommentAction(content: ReadableMap) {}
  
  @ReactMethod @Suppress("UNUSED_PARAMETER")
  fun logMakeOfferAction(content: ReadableMap) {}
  
  @ReactMethod @Suppress("UNUSED_PARAMETER")
  fun logAskQuestionAction(content: ReadableMap) {}
  
  @ReactMethod @Suppress("UNUSED_PARAMETER")
  fun logAnswerQuestionAction(content: ReadableMap) {}
  
  @ReactMethod
  fun logCompleteSignInAction() {}
  
  @ReactMethod
  fun logCompleteSignUpAction() {}
  
  @ReactMethod
  fun logAction(name: String) {}
  
  @ReactMethod @Suppress("UNUSED_PARAMETER")
  fun logActionWithType(name: String, type: Int) {}
  
  @ReactMethod @Suppress("UNUSED_PARAMETER")
  fun logActionWithContent(name: String, type: Int, content: ReadableMap) {}
  
  @ReactMethod @Suppress("UNUSED_PARAMETER")
  fun logView(screenName: String) {}
  
  @ReactMethod @Suppress("UNUSED_PARAMETER")
  fun collectionViewDidLoad(collectionViewName: String) {}
  
  @ReactMethod @Suppress("UNUSED_PARAMETER")
  fun collectionViewDidChange(visibleContent: ReadableArray,
                              collectionViewName: String) {}

  @ReactMethod @Suppress("UNUSED_PARAMETER")
  fun collectionViewDidUnmount(collectionViewName: String) {}

  @ReactMethod @Suppress("UNUSED_PARAMETER")
  fun getLoggingSessionInfo(promise: Promise) {
    WritableMap result = WritableMap();
    map.putString("logUserId", "");
    map.putString("sessionId", "");
    map.putString("viewId", "");
    promise(map);
  }
}
