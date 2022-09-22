#import "React/RCTBridgeModule.h"

/** See src/index.tsx for method docs. */
@interface RCT_EXTERN_REMAP_MODULE(PromotedMetrics, PromotedMetricsModule, NSObject)

#pragma mark - Starting new sessions

RCT_EXTERN_METHOD(startSessionAndLogUser:(NSString *)userID)

RCT_EXTERN_METHOD(startSessionAndLogSignedOutUser)

#pragma mark - Impressions

RCT_EXTERN_METHOD(logImpression:(nullable NSDictionary *)args)

#pragma mark - Actions

RCT_EXTERN_METHOD(logAction:(nullable NSDictionary *)args)

#pragma mark - Views

RCT_EXTERN_METHOD(logView:(nullable NSDictionary *)args)

RCT_EXTERN_METHOD(logAutoView:(nullable NSDictionary *)args)

#pragma mark - CollectionTracker

RCT_EXTERN_METHOD(collectionDidMount:(nullable NSDictionary *)args)

RCT_EXTERN_METHOD(collectionDidChange:(nullable NSDictionary *)args)

RCT_EXTERN_METHOD(collectionActionDidOccur:(nullable NSDictionary *)args)

RCT_EXTERN_METHOD(collectionWillUnmount:(nullable NSDictionary *)args)

#pragma mark - Ancestor IDs

RCT_EXTERN_METHOD(getCurrentOrPendingAncestorIds:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(setAncestorIds:(nullable NSDictionary *)ancestorIDs)

#pragma mark - Introspection

RCT_EXTERN_METHOD(showItemIntrospection:(nullable NSDictionary *)args)

@end
