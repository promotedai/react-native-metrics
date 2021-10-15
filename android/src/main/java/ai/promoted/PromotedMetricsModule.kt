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
  fun logImpression(args: ReadableMap) {
    // TODO: Support ImpressionSourceType in android-metrics-sdk
    PromotedAi.onImpression(args.toImpressionData())
  }

  @ReactMethod
  @Suppress("Unused")
  fun logAction(args: ReadableMap) {
    val type = args.actionType() ?: return
    val name = args.destinationScreenName() ?: args.actionName() ?: ""
    // TODO: Support AutoView in android-metrics-sdk
    PromotedAi.onAction(name, type, args.toActionData())
  }

  @ReactMethod
  @Suppress("Unused")
  fun logView(args: ReadableMap) {
    val routeName = args.routeName() ?: return
    PromotedAi.logView(routeName)
  }

  @ReactMethod
  @Suppress("Unused")
  fun logAutoView(args: ReadableMap) {
    val autoViewId = args.autoViewId() ?: return
    val routeName = args.routeName() ?: ""
    val routeKey = args.routeKey() ?: ""
    PromotedAi.logAutoView(autoViewId, routeName, routeKey)
  }

  @ReactMethod
  @Suppress("Unused")
  fun collectionDidMount(args: ReadableMap) {
    val id = args.collectionId() ?: return
    // TODO: Support ImpressionSourceType in android-metrics-sdk
    PromotedAi.onCollectionVisible(null, id, emptyList())
  }

  @ReactMethod
  @Suppress("Unused")
  fun collectionDidChange(args: ReadableMap) {
    val id = args.collectionId() ?: return
    val visibleContent = args.visibleContent() ?: return

    val visibleContentForSdk =
      visibleContent
        .toArrayList()
        .mapNotNull { arrayItem ->
          arrayItem.toContent()
        }

    PromotedAi.onCollectionUpdated(null, id, visibleContentForSdk)
  }

  @ReactMethod
  @Suppress("Unused")
  fun collectionActionDidOccur(args: ReadableMap) {
    // TODO: Use the collectionId to read impressionId
    // for content from collection tracker.
    // val id = args.collectionId() ?: return
    val content = args.content() ?: return
    val type = args.actionType() ?: return
    val name = args.actionName() ?: ""
    // TODO: Support AutoView in android-metrics-sdk
    PromotedAi.onAction(name, type, args.toActionData())
  }

  @ReactMethod
  @Suppress("Unused")
  fun collectionWillUnmount(args: ReadableMap) {
    val id = args.collectionId() ?: return
    PromotedAi.onCollectionHidden(null, id)
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
    val content = content()
    val insertionId = content?.insertionId() ?: insertionId()
    val contentId = content?.contentId() ?: contentId()
    val autoViewId = autoViewId()
    val hasSuperimposedViews =  hasSuperimposedViews()
    return ActionData.Builder().apply {
      this.insertionId = insertionId
      this.contentId = contentId
      this.autoViewId = autoViewId
      this.hasSuperimposedViews = hasSuperimposedViews
    }.build(null)
  }

  /**
   * Convert an RN [ReadableMap] to an [ImpressionData].
   */
  private fun Any?.toImpressionData(): ImpressionData {
    val content = content()
    val insertionId = content?.insertionId() ?: insertionId()
    val contentId = content?.contentId() ?: contentId()
    val autoViewId = autoViewId()
    val hasSuperimposedViews = hasSuperimposedViews()
    return ImpressionData.Builder().apply {
      this.insertionId = insertionId
      this.contentId = contentId
      this.autoViewId = autoViewId
      this.hasSuperimposedViews = hasSuperimposedViews
    }.build(null)
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

  // Argument to logging methods

  private fun Any?.actionName(): String? = when (this) {
    is ReadableMap -> getString("actionName")
    else -> null
  }

  private fun Any?.actionType(): ActionType? = when (this) {
    is ReadableMap -> {
      if (hasKey("actionType"))
        ActionType.forNumber(getInt("actionType"))
      else ActionType.UNKNOWN_ACTION_TYPE
    } else -> null
  }

  private fun Any?.autoViewId(): String? = when (this) {
    is ReadableMap -> getString("autoViewId")
    else -> null
  }

  private fun Any?.collectionId(): String? = when (this) {
    is ReadableMap -> getString("collectionId")
    else -> null
  }

  private fun Any?.content(): ReadableMap? = when (this) {
    is ReadableMap -> getMap("content")
    else -> null
  }

  private fun Any?.destinationScreenName(): String? = when (this) {
    is ReadableMap -> getString("destinationScreenName")
    else -> null
  }

  private fun Any?.hasSuperimposedViews(): Boolean = when (this) {
    is ReadableMap -> {
      if (hasKey("hasSuperimposedViews"))
        getBoolean("hasSuperimposedViews")
      else false
    } else -> false
  }

  // TODO: Support ImpressionSourceType in android-metrics-sdk.
  // private fun Any?.impressionSourceType(): ImpressionSourceType? = when (this) {
  //   is ReadableMap -> {
  //     if (hasKey("impressionSourceType"))
  //       ImpressionSourceType.forNumber(getInt("impressionSourceType"))
  //     else ImpressionSourceType.UNKNOWN_IMPRESSION_SOURCE_TYPE
  //   else -> null
  // }

  private fun Any?.routeName(): String? = when (this) {
    is ReadableMap -> getString("routeName")
    else -> null
  }

  private fun Any?.routeKey(): String? = when (this) {
    is ReadableMap -> getString("routeKey")
    else -> null
  }

  private fun Any?.visibleContent(): ReadableArray? = when (this) {
    is ReadableMap -> getArray("visibleContent")
    else -> null
  }
}
