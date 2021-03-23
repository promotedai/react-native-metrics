#import "React/RCTBridgeModule.h"

/** See PromotedLoggerModule.swift for method docs. */
@interface RCT_EXTERN_REMAP_MODULE(PromotedMetrics, PromotedMetricsModule, NSObject)

#pragma mark - Starting new sessions
RCT_EXTERN_METHOD(startSessionAndLogUser:(NSString *)userID)

RCT_EXTERN_METHOD(startSessionAndLogSignedOutUser)

#pragma mark - Impressions
/// @param content (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logImpression:(nullable NSDictionary *)content)

#pragma mark - Clicks
/// @param content (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logClickToLike:(nullable NSDictionary *)content
                  didLike:(BOOL)didLike)

RCT_EXTERN_METHOD(logClickToShow:(NSString *)screenName)

/// @param content (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logClickToShow:(NSString *)screenName
                  forContent:(nullable NSDictionary *)content)

RCT_EXTERN_METHOD(logClickToSignUp:(NSString *)userID)

/// @param item (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logClickToPurchase:(nullable NSDictionary *)item)

RCT_EXTERN_METHOD(logClickWithActionName:(NSString *)action)

/// @param content (NSDictionary<NSString, id>)
RCT_EXTERN_METHOD(logClickWithActionName:(NSString *)action
                  content:(nullable NSDictionary *)content)

#pragma mark - Views
RCT_EXTERN_METHOD(logView:(NSString *)screenName)

#pragma mark - ImpressionLogger
RCT_EXTERN_METHOD(collectionViewDidLoad:(NSString *)collectionViewName)

/// @param visibleContent (`NSArray<NSDictionary<String, id>>`)
RCT_EXTERN_METHOD(collectionViewDidChange:(NSArray *)visibleContent
                  collectionViewName:(NSString *)collectionViewName)

RCT_EXTERN_METHOD(collectionViewDidUnmount:(NSString *)collectionViewName)

@end
