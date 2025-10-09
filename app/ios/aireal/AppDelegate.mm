#import "RNFBMessagingModule.h"
#import "AppDelegate.h"
#import <Firebase.h>
#import <FirebaseAnalytics/FIRAnalytics.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>

@implementation AppDelegate
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"aireal";
  self.dependencyProvider = [RCTAppDependencyProvider new];
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  self.initialProps = [RNFBMessagingModule addCustomPropsToUserProps:nil withLaunchOptions:launchOptions];
  [FIRApp configure];
  
  [FIRAnalytics setAnalyticsCollectionEnabled:YES];
  
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}
- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}
 
- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

// Handle universal links
- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
  return [RCTLinkingManager application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
}

// Handle custom URL schemes
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

@end
