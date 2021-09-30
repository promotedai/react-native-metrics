#import "React/RCTBridgeModule.h"

/** See src/index.tsx for method docs. */
@interface RCT_EXTERN_REMAP_MODULE(PromotedMetrics, PromotedMetricsModule, NSObject)

#pragma mark - Starting new sessions

RCT_EXTERN_METHOD(startSessionAndLogUser:(NSString *)userID)

RCT_EXTERN_METHOD(startSessionAndLogSignedOutUser)

#pragma mark - Impressions

/// @param args (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logImpression:(nullable NSDictionary *)args)

#pragma mark - Actions

/// @param args (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logAction:(nullable NSDictionary *)args)

#pragma mark - Views

RCT_EXTERN_METHOD(logView:(nullable NSDictionary *)args)

RCT_EXTERN_METHOD(logAutoView:(nullable NSDictionary *)args)

#pragma mark - CollectionTracker

RCT_EXTERN_METHOD(collectionDidMount:(NSString *)collectionID
                  sourceType:(NSInteger)sourceType)

/// @param visibleContent (`NSArray<NSDictionary<String, id>>`)
RCT_EXTERN_METHOD(collectionDidChange:(NSArray *)visibleContent
                  collectionID:(NSString *)collectionID)

/// @param content (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(collectionActionDidOccur:(NSInteger)actionType
                  content:(nullable NSDictionary *)content
                  name:(NSString *)name
                  collectionID:(NSString *)collectionID)

RCT_EXTERN_METHOD(collectionWillUnmount:(NSString *)collectionID)

#pragma mark - Ancestor IDs

RCT_EXTERN_METHOD(getCurrentOrPendingAncestorIds:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(setAncestorIds:(nullable NSDictionary *)ancestorIDs)

@end
