
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNRnSocialLoginSpec.h"

@interface RnSocialLogin : NSObject <NativeRnSocialLoginSpec>
#else
#import <React/RCTBridgeModule.h>

@interface RnSocialLogin : NSObject <RCTBridgeModule>
#endif

@end
