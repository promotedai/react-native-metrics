#import "React/RCTBridgeModule.h"

/** See src/index.tsx for method docs. */
@interface RCT_EXTERN_REMAP_MODULE(PromotedMetrics, PromotedMetricsModule, NSObject)

#pragma mark - Starting new sessions
RCT_EXTERN_METHOD(startSessionAndLogUser:(NSString *)userID)

RCT_EXTERN_METHOD(startSessionAndLogSignedOutUser)

#pragma mark - Impressions

/// @param content (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logImpression:(nullable NSDictionary *)content)

/// @param content (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logImpressionWithSourceType:(nullable NSDictionary *)content
                  sourceType:(NSInteger)sourceType)

#pragma mark - Clicks

/// @param content (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logNavigateAction:(nullable NSDictionary *)content)

/// @param content (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logNavigateActionWithScreenName:(nullable NSDictionary *)content
                  screenName:(NSString *)screenName)

/// @param content (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logAction:(NSInteger)type
                  content:(nullable NSDictionary *)content)

/// @param content (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logActionWithName:(NSInteger)type
                  content:(nullable NSDictionary *)content
                  name:(NSString *)name)


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
RCT_EXTERN_METHOD(collectionViewDidMount:(NSString *)collectionID
                  sourceType:(NSInteger)sourceType)

/// @param visibleContent (`NSArray<NSDictionary<String, id>>`)
RCT_EXTERN_METHOD(collectionViewDidChange:(NSArray *)visibleContent
                  collectionID:(NSString *)collectionID)

/// @param content (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(collectionViewActionDidOccur:(NSInteger)actionType
                  content:(nullable NSDictionary *)content
                  collectionID: (NSString *)collectionID)

RCT_EXTERN_METHOD(collectionViewWillUnmount:(NSString *)collectionID)

#pragma mark - Ancestor IDs
RCT_EXTERN_METHOD(getCurrentOrPendingAncestorIds:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(setAncestorIds:(nullable NSDictionary *)ancestorIDs)

@end
