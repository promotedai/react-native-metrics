package ai.promoted

import com.facebook.react.bridge.*

class PromotedMetricsModule(
  configDependencies: PromotedMetricsPackage.ConfigDependencies?,
  reactContext: ReactApplicationContext
) :
  ReactContextBaseJavaModule(reactContext) {

  init {
    configDependencies?.let { PromotedAi.initialize(it.application, it.clientConfig) }
  }

  override fun getName(): String {
    return "PromotedMetrics"
  }

  @ReactMethod
  @Suppress("Unused")
  fun startSessionAndLogUser(userId: String?) {
    val nullSafeUserId = userId ?: ""
    PromotedAi.startSession(nullSafeUserId)
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
  fun logView(screenName: String?) {
    screenName ?: return
    PromotedAi.onViewVisible(screenName)
  }

  @ReactMethod
  @Suppress("Unused")
  fun collectionViewDidLoad(collectionViewName: String?) {
    collectionViewName ?: return
    PromotedAi.onCollectionVisible(collectionViewName, emptyList())
  }

  @ReactMethod
  @Suppress("Unused")
  fun collectionViewDidChange(visibleContent: ReadableArray?,
                              collectionViewName: String?) {
    collectionViewName ?: return
    visibleContent ?: return

    val visibleContentForSdk =
      visibleContent
        .toArrayList()
        .mapNotNull { arrayItem ->
          (arrayItem as? ReadableMap)?.toContent()
        }

    PromotedAi.onCollectionUpdated(collectionViewName, visibleContentForSdk)
  }

  @ReactMethod
  @Suppress("Unused")
  fun collectionViewDidUnmount(collectionViewName: String?) {
    collectionViewName ?: return
    PromotedAi.onCollectionHidden(collectionViewName)
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

  /**
   * Convert an RN [ReadableMap] to an [AbstractContent.Content].
   */
  private fun ReadableMap?.toContent(): AbstractContent.Content? {
    this ?: return null
    val insertionId =
      getString("insertion-id")
        ?: getString("insertionId")

    val contentId =
      getString("content-id")
        ?: getString("contentId")
        ?: getString("_id")

    return AbstractContent.Content(
      name = getString("name") ?: "",
      insertionId = insertionId,
      contentId = contentId
    )
  }
}
