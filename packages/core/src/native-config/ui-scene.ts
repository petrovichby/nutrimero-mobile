/**
 * iOS 27 requires the UIScene life cycle: UIKit traps at launch
 * (`_UIApplicationEvaluateRuntimeIssueForNoSceneLifecycleAdoption`) when an app has no scene
 * manifest. Expo SDK 57 ships the scene delegate (`EXExpoAppSceneDelegate`) but its prebuild
 * template still starts React Native from the app delegate, so both apps adopt it here, through
 * one config plugin (`plugins/with-ui-scene.cjs`). Pure transforms, so they are testable under Node.
 */

export const SCENE_DELEGATE_CLASS = "EXExpoAppSceneDelegate";

export const SCENE_MANIFEST = {
  UIApplicationSupportsMultipleScenes: false,
  UISceneConfigurations: {
    UIWindowSceneSessionRoleApplication: [
      {
        UISceneConfigurationName: "Default Configuration",
        UISceneDelegateClassName: SCENE_DELEGATE_CLASS,
      },
    ],
  },
} as const;

/** Adds the scene manifest to an Info.plist object; any existing manifest is replaced. */
export function withSceneManifest<T extends Record<string, unknown>>(plist: T) {
  return { ...plist, UIApplicationSceneManifest: SCENE_MANIFEST };
}

const CLASS_LINE = "class AppDelegate: ExpoAppDelegate {";
const ADOPTED_CLASS_LINE = "class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {";

/** The template's window + start, which the scene delegate now owns. */
const APP_DELEGATE_START =
  /\n#if os\(iOS\) \|\| os\(tvOS\)\n\s*window = UIWindow\(frame: UIScreen\.main\.bounds\)\n\s*factory\.startReactNative\(\n\s*withModuleName: "main",\n\s*in: window,\n\s*launchOptions: launchOptions\)\n#endif\n/;

const SCENE_NOTE =
  "\n    // iOS 27 scene life cycle: EXExpoAppSceneDelegate creates the window and starts React\n" +
  "    // Native into it (packages/core/plugins/with-ui-scene.cjs).\n";

/**
 * Makes the SDK 57 template's Swift app delegate a React Native factory provider and removes its
 * own window creation. Idempotent. Throws when the template has drifted, so a changed Expo
 * template fails the prebuild instead of shipping an app that still traps on iOS 27.
 */
export function adoptSceneLifecycle(appDelegate: string): string {
  if (appDelegate.includes(ADOPTED_CLASS_LINE) && !APP_DELEGATE_START.test(appDelegate)) {
    return appDelegate;
  }
  if (!appDelegate.includes(CLASS_LINE) || !APP_DELEGATE_START.test(appDelegate)) {
    throw new Error(
      "with-ui-scene: the AppDelegate no longer matches Expo SDK 57's template — update " +
        "packages/core/src/native-config/ui-scene.ts for the new template before prebuilding.",
    );
  }
  return appDelegate
    .replace(CLASS_LINE, ADOPTED_CLASS_LINE)
    .replace(APP_DELEGATE_START, SCENE_NOTE);
}
