package ai.promoted

import ai.promoted.proto.event.ActionType
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
  @Suppress("Unused")
  fun logImpression(content: ReadableMap?) =
    content.toImpressionData()?.let { PromotedAi.onImpression(it) }

  @ReactMethod
  @Suppress("Unused")
  // TODO: Support ImpressionSourceType in android-metrics-sdk
  fun logImpressionWithSourceType(content: ReadableMap?, sourceType: Int) =
    content.toImpressionData()?.let { PromotedAi.onImpression(it) }

  @ReactMethod
  @Suppress("Unused")
  fun logNavigateAction(screenName: String) =
    PromotedAi.onAction(screenName, ActionType.NAVIGATE) {}

  @ReactMethod
  @Suppress("Unused")
  fun logNavigateActionWithContent(screenName: String, content: ReadableMap) =
    PromotedAi.onAction(screenName, ActionType.NAVIGATE, content.toActionData())

  @ReactMethod
  @Suppress("Unused")
  fun logAddToCartAction(item: ReadableMap) =
    PromotedAi.onAction("add-to-cart", ActionType.ADD_TO_CART, item.toActionData())

  @ReactMethod
  @Suppress("Unused")
  fun logRemoveFromCartAction(item: ReadableMap) =
    PromotedAi.onAction("remove-from-cart", ActionType.REMOVE_FROM_CART, item.toActionData())

  @ReactMethod
  @Suppress("Unused")
  fun logCheckoutAction() =
    PromotedAi.onAction("checkout", ActionType.CHECKOUT) {}

  @ReactMethod
  @Suppress("Unused")
  fun logPurchaseAction(item: ReadableMap) =
    PromotedAi.onAction("purchase", ActionType.PURCHASE, item.toActionData())

  @ReactMethod
  @Suppress("Unused")
  fun logShareAction(content: ReadableMap) =
    PromotedAi.onAction("share", ActionType.SHARE, content.toActionData())

  @ReactMethod
  @Suppress("Unused")
  fun logLikeAction(content: ReadableMap) =
    PromotedAi.onAction("like", ActionType.LIKE, content.toActionData())

  @ReactMethod
  @Suppress("Unused")
  fun logUnlikeAction(content: ReadableMap) =
    PromotedAi.onAction("unlike", ActionType.UNLIKE, content.toActionData())

  @ReactMethod
  @Suppress("Unused")
  fun logCommentAction(content: ReadableMap) =
    PromotedAi.onAction("comment", ActionType.COMMENT, content.toActionData())

  @ReactMethod
  @Suppress("Unused")
  fun logMakeOfferAction(content: ReadableMap) =
    PromotedAi.onAction("make-offer", ActionType.MAKE_OFFER, content.toActionData())

  @ReactMethod
  @Suppress("Unused")
  fun logAskQuestionAction(content: ReadableMap) =
    PromotedAi.onAction("ask-question", ActionType.ASK_QUESTION, content.toActionData())

  @ReactMethod
  @Suppress("Unused")
  fun logAnswerQuestionAction(content: ReadableMap) =
    PromotedAi.onAction("answer-question", ActionType.ANSWER_QUESTION, content.toActionData())

  @ReactMethod
  @Suppress("Unused")
  fun logCompleteSignInAction() =
    PromotedAi.onAction("sign-in", ActionType.COMPLETE_SIGN_IN) {}

  @ReactMethod
  @Suppress("Unused")
  fun logCompleteSignUpAction() =
    PromotedAi.onAction("sign-up", ActionType.COMPLETE_SIGN_UP) {}

  @ReactMethod
  @Suppress("Unused")
  fun logAction(name: String) =
    PromotedAi.onAction(name, ActionType.CUSTOM_ACTION_TYPE) {}

  @ReactMethod
  @Suppress("Unused")
  fun logActionWithType(name: String, type: Int) {
    val actionType = ActionType.forNumber(type) ?: return
    PromotedAi.onAction(name, actionType) {}
  }

  @ReactMethod
  @Suppress("Unused")
  fun logActionWithContent(name: String, type: Int, content: ReadableMap) {
    val actionType = ActionType.forNumber(type) ?: return
    PromotedAi.onAction(name, actionType, content.toActionData())
  }

  @ReactMethod
  @Suppress("Unused")
  fun logView(screenName: String?) {
    screenName ?: return
    PromotedAi.onViewVisible(screenName)
  }

  @ReactMethod
  @Suppress("Unused")
  fun collectionViewDidMount(collectionViewName: String?, sourceType: Int) {
    // TODO: Support ImpressionSourceType in android-metrics-sdk
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
  fun collectionViewWillUnmount(collectionViewName: String?) {
    collectionViewName ?: return
    PromotedAi.onCollectionHidden(collectionViewName)
  }

  @ReactMethod
  @Suppress("Unused")
  fun getCurrentOrPendingAncestorIds(promise: Promise) {
    promise.resolve(
      Arguments.createMap().apply {
        putString("logUserId", PromotedAi.logUserId)
        putString("sessionId", PromotedAi.sessionId)
        putString("viewId", PromotedAi.viewId)
      }
    )
  }

  @ReactMethod
  @Suppress("Unused")
  fun setAncestorIds(ancestorIds: ReadableMap) {
    val logUserId = ancestorIds.getString("logUserId")
    if (logUserId != null) PromotedAi.logUserId = logUserId

    val sessionId = ancestorIds.getString("sessionId")
    if (sessionId != null) PromotedAi.sessionId = sessionId

    val viewId = ancestorIds.getString("viewId")
    if (viewId != null) PromotedAi.viewId = viewId
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

  /**
   * Convert an RN [ReadableMap] to an [ActionData].
   */
  private fun ReadableMap?.toActionData(): ActionData {
    this ?: return ActionData.Builder().build()
    val insertionId =
      getString("insertion-id")
        ?: getString("insertionId")

    val contentId =
      getString("content-id")
        ?: getString("contentId")
        ?: getString("_id")

    return ActionData.Builder().apply {
      this.insertionId = insertionId
      this.contentId = contentId
    }.build()
  }

  /**
   * Convert an RN [ReadableMap] to an [ActionData].
   */
  private fun ReadableMap?.toImpressionData(): ImpressionData? {
    this ?: return null
    val insertionId =
      getString("insertion-id")
        ?: getString("insertionId")

    val contentId =
      getString("content-id")
        ?: getString("contentId")
        ?: getString("_id")

    return ImpressionData.Builder().apply {
      this.insertionId = insertionId
      this.contentId = contentId
    }.build()
  }
}
