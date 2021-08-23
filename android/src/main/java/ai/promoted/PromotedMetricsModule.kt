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
  fun logImpression(content: ReadableMap?) {
    PromotedAi.onImpression(content.toImpressionData())
  }

  @ReactMethod
  @Suppress("Unused")
  // TODO: Support ImpressionSourceType in android-metrics-sdk
  fun logImpressionWithSourceType(content: ReadableMap?, sourceType: Int) {
    PromotedAi.onImpression(content.toImpressionData())
  }

  @ReactMethod
  @Suppress("Unused")
  fun logNavigateAction(content: ReadableMap) =
    PromotedAi.onAction(ActionType.NAVIGATE.toString(), ActionType.NAVIGATE, content.toActionData())

  @ReactMethod
  @Suppress("Unused")
  fun logNavigateActionWithScreenName(content: ReadableMap, screenName: String) =
    PromotedAi.onAction(screenName, ActionType.NAVIGATE, content.toActionData())

  @ReactMethod
  @Suppress("Unused")
  fun logAction(type: Int, content: ReadableMap) {
    val actionType = ActionType.forNumber(type) ?: return
    PromotedAi.onAction(actionType.toString(), actionType, content.toActionData())
  }

  @ReactMethod
  @Suppress("Unused")
  fun logActionWithName(type: Int, content: ReadableMap, name: String) {
    val actionType = ActionType.forNumber(type) ?: return
    PromotedAi.onAction(name, actionType, content.toActionData())
  }

  @ReactMethod
  @Suppress("Unused")
  fun logViewReady(routeName: String?, routeKey: String?) {
    routeName ?: return
    PromotedAi.onViewVisible(routeName)
  }

  @ReactMethod
  @Suppress("Unused")
  fun logViewChange(routeName: String?, routeKey: String?) {
    routeName ?: return
    PromotedAi.onViewVisible(routeName)
  }

  @ReactMethod
  @Suppress("Unused")
  fun collectionViewDidMount(id: String?, sourceType: Int) {
    // TODO: Support ImpressionSourceType in android-metrics-sdk
    id ?: return
    PromotedAi.onCollectionVisible(id, emptyList())
  }

  @ReactMethod
  @Suppress("Unused")
  fun collectionViewDidChange(visibleContent: ReadableArray?,
                              id: String?) {
    id ?: return
    visibleContent ?: return

    val visibleContentForSdk =
      visibleContent
        .toArrayList()
        .mapNotNull { arrayItem ->
          arrayItem.toContent()
        }

    PromotedAi.onCollectionUpdated(id, visibleContentForSdk)
  }

  @ReactMethod
  @Suppress("Unused")
  fun collectionViewActionDidOccur(type: Int,
                                   content: ReadableMap,
                                   name: String?,
                                   id: String?) {
    id ?: return
    val actionType = ActionType.forNumber(type) ?: return
    // TODO: Map impressionId for content.
    PromotedAi.onAction(name ?: "", actionType, content.toActionData())
  }

  @ReactMethod
  @Suppress("Unused")
  fun collectionViewWillUnmount(id: String?) {
    id ?: return
    PromotedAi.onCollectionHidden(id)
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
   * Convert a [HashMap] to an [AbstractContent.Content].
   */
  private fun Any?.toContent(): AbstractContent.Content = AbstractContent.Content(
    name = name(),
    insertionId = insertionId(),
    contentId = contentId()
  )

  /**
   * Convert an RN [ReadableMap] to an [ActionData].
   */
  private fun Any?.toActionData(): ActionData {
    val insertionId = insertionId()
    val contentId = contentId()
    return ActionData.Builder().apply {
      this.insertionId = insertionId
      this.contentId = contentId
    }.build()
  }

  /**
   * Convert an RN [ReadableMap] to an [ActionData].
   */
  private fun Any?.toImpressionData(): ImpressionData {
    val insertionId = insertionId()
    val contentId = contentId()
    return ImpressionData.Builder().apply {
      this.insertionId = insertionId
      this.contentId = contentId
    }.build()
  }

  private fun Any?.name(): String = when (this) {
    is ReadableMap -> getString("name") ?: ""
    is Map<*, *> -> this["name"] as? String? ?: ""
    else -> ""
  }

  private fun Any?.insertionId(): String? = when (this) {
    is ReadableMap -> {
      getString("insertion_id")
        ?: getString("insertion-id")
        ?: getString("insertionId")
    }
    is Map<*, *> -> {
      this["insertion_id"] as? String?
        ?: this["insertion-id"] as? String?
        ?: this["insertionId"] as? String?
    }
    else -> null
  }

  private fun Any?.contentId(): String? = when (this) {
    is ReadableMap -> {
      getString("content_id")
        ?: getString("content-id")
        ?: getString("contentId")
        ?: getString("_id")
    }
    is Map<*, *> -> {
      this["content_id"] as? String?
        ?: this["content-id"] as? String?
        ?: this["contentId"] as? String?
        ?: this["_id"] as? String?
    }
    else -> null
  }
}
