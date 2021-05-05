package ai.promoted

import android.app.Application
import com.facebook.react.bridge.*

class PromotedMetricsModule(
  // TODO - pass in custom configuration
  application: Application,
  config: ClientConfig,
  reactContext: ReactApplicationContext
) :
  ReactContextBaseJavaModule(reactContext) {

  init {
    PromotedAi.initialize(application, config)
  }

  override fun getName(): String {
    return "PromotedMetrics"
  }

  @ReactMethod
  @Suppress("Unused")
  fun startSessionAndLogUser(userId: String) {
    PromotedAi.startSession(userId)
  }

  @ReactMethod
  @Suppress("Unused")
  fun startSessionAndLogSignedOutUser() {
    PromotedAi.startSession()
  }

  @ReactMethod
  @Suppress("Unused", "UNUSED_PARAMETER")
  fun logImpression(content: ReadableMap) {
  }

  @ReactMethod
  @Suppress("Unused", "UNUSED_PARAMETER")
  fun logNavigateAction(screenName: String) {
  }

  @ReactMethod
  @Suppress("Unused", "UNUSED_PARAMETER")
  fun logNavigateActionWithContent(screenName: String, content: ReadableMap) {
  }

  @ReactMethod
  @Suppress("Unused", "UNUSED_PARAMETER")
  fun logAddToCartAction(item: ReadableMap) {
  }

  @ReactMethod
  @Suppress("Unused", "UNUSED_PARAMETER")
  fun logRemoveFromCartAction(item: ReadableMap) {
  }

  @ReactMethod
  @Suppress("Unused")
  fun logCheckoutAction() {
  }

  @ReactMethod
  @Suppress("Unused", "UNUSED_PARAMETER")
  fun logPurchaseAction(item: ReadableMap) {
  }

  @ReactMethod
  @Suppress("Unused", "UNUSED_PARAMETER")
  fun logShareAction(content: ReadableMap) {
  }

  @ReactMethod
  @Suppress("Unused", "UNUSED_PARAMETER")
  fun logLikeAction(content: ReadableMap) {
  }

  @ReactMethod
  @Suppress("Unused", "UNUSED_PARAMETER")
  fun logUnlikeAction(content: ReadableMap) {
  }

  @ReactMethod
  @Suppress("Unused", "UNUSED_PARAMETER")
  fun logCommentAction(content: ReadableMap) {
  }

  @ReactMethod
  @Suppress("Unused", "UNUSED_PARAMETER")
  fun logMakeOfferAction(content: ReadableMap) {
  }

  @ReactMethod
  @Suppress("Unused", "UNUSED_PARAMETER")
  fun logAskQuestionAction(content: ReadableMap) {
  }

  @ReactMethod
  @Suppress("Unused", "UNUSED_PARAMETER")
  fun logAnswerQuestionAction(content: ReadableMap) {
  }

  @ReactMethod
  @Suppress("Unused")
  fun logCompleteSignInAction() {
  }

  @ReactMethod
  @Suppress("Unused")
  fun logCompleteSignUpAction() {
  }

  @ReactMethod
  @Suppress("Unused", "UNUSED_PARAMETER")
  fun logAction(name: String) {
  }

  @ReactMethod
  @Suppress("Unused", "UNUSED_PARAMETER")
  fun logActionWithType(name: String, type: Int) {
  }

  @ReactMethod
  @Suppress("Unused", "UNUSED_PARAMETER")
  fun logActionWithContent(name: String, type: Int, content: ReadableMap) {
  }

  @ReactMethod
  @Suppress("Unused")
  fun logView(screenName: String) {
    PromotedAi.onViewVisible(screenName)
  }

  @ReactMethod
  @Suppress("Unused", "UNUSED_PARAMETER")
  fun collectionViewDidLoad(collectionViewName: String) {
  }

  @ReactMethod
  @Suppress("Unused", "UNUSED_PARAMETER")
  fun collectionViewDidChange(visibleContent: ReadableArray,
                              collectionViewName: String) {
  }

  @ReactMethod
  @Suppress("Unused", "UNUSED_PARAMETER")
  fun collectionViewDidUnmount(collectionViewName: String) {
  }

  @ReactMethod
  @Suppress("Unused", "UNUSED_PARAMETER")
  fun getLoggingSessionInfo(promise: Promise) {
    val map = Arguments.createMap()
    map.putString("logUserId", "")
    map.putString("sessionId", "")
    map.putString("viewId", "")
    promise.resolve(map)
  }
}
