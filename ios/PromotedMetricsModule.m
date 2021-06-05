#import "React/RCTBridgeModule.h"

/** See src/index.tsx for method docs. */
@interface RCT_EXTERN_REMAP_MODULE(PromotedMetrics, PromotedMetricsModule, NSObject)

#pragma mark - Starting new sessions
RCT_EXTERN_METHOD(startSessionAndLogUser:(NSString *)userID)

RCT_EXTERN_METHOD(startSessionAndLogSignedOutUser)

#pragma mark - Impressions
/// @param content (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logImpression:(nullable NSDictionary *)content)

#pragma mark - Clicks

RCT_EXTERN_METHOD(logNavigateAction:(NSString *)screenName)

/// @param content (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logNavigateActionWithContent:(NSString *)screenName
                  forContent:(nullable NSDictionary *)content)

/// @param item (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logAddToCartAction:(nullable NSDictionary *)item)

/// @param item (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logRemoveFromCartAction:(nullable NSDictionary *)item)

RCT_EXTERN_METHOD(logCheckoutAction)

/// @param item (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logPurchaseAction:(nullable NSDictionary *)item)

/// @param content (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logShareAction:(nullable NSDictionary *)content)

/// @param content (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logLikeAction:(nullable NSDictionary *)content)

/// @param content (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logUnlikeAction:(nullable NSDictionary *)content)

/// @param content (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logCommentAction:(nullable NSDictionary *)content)

/// @param item (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logMakeOfferAction:(nullable NSDictionary *)item)

/// @param content (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logAskQuestionAction:(nullable NSDictionary *)content)

/// @param content (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logAnswerQuestionAction:(nullable NSDictionary *)content)

RCT_EXTERN_METHOD(logCompleteSignInAction)

RCT_EXTERN_METHOD(logCompleteSignUpAction)

RCT_EXTERN_METHOD(logAction:(NSString *)name)

RCT_EXTERN_METHOD(logActionWithType:(NSString *)name
                  type:(NSInteger)type)

/// @param content (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logActionWithContent:(NSString *)name
                  type:(NSInteger)type
                  content:(nullable NSDictionary *)content)

#pragma mark - Views
RCT_EXTERN_METHOD(logViewReady:(NSString *)routeName
                  routeKey:(NSString *)routeKey)

RCT_EXTERN_METHOD(logViewReadyWithUseCase:(NSString *)routeName
                  routeKey:(NSString *)routeKey
                  useCase:(NSInteger)useCase)

RCT_EXTERN_METHOD(logViewChange:(NSString *)routeName
                  routeKey:(NSString *)routeKey)

RCT_EXTERN_METHOD(logViewChangeWithUseCase:(NSString *)routeName
                  routeKey:(NSString *)routeKey
                  useCase:(NSInteger)useCase)

#pragma mark - ImpressionLogger
RCT_EXTERN_METHOD(collectionViewDidMount:(NSString *)collectionViewName)

/// @param visibleContent (`NSArray<NSDictionary<String, id>>`)
RCT_EXTERN_METHOD(collectionViewDidChange:(NSArray *)visibleContent
                  collectionViewName:(NSString *)collectionViewName)

RCT_EXTERN_METHOD(collectionViewWillUnmount:(NSString *)collectionViewName)

#pragma mark - Pending ancestor IDs
RCT_EXTERN_METHOD(getCurrentOrPendingAncestorIds:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

@end
