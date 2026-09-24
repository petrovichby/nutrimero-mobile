import { describe, expect, it } from "vitest";
import { APP_DELEGATE_SDK57 as template } from "./fixtures/app-delegate-sdk57";
import { adoptSceneLifecycle, SCENE_DELEGATE_CLASS, withSceneManifest } from "./ui-scene";

describe("the iOS 27 scene life cycle (both apps' config plugin)", () => {
  it("names Expo's scene delegate for the application role", () => {
    const plist = withSceneManifest({ CFBundleName: "x" });
    expect(plist.CFBundleName).toBe("x");
    expect(
      plist.UIApplicationSceneManifest.UISceneConfigurations.UIWindowSceneSessionRoleApplication[0]
        ?.UISceneDelegateClassName,
    ).toBe(SCENE_DELEGATE_CLASS);
    expect(plist.UIApplicationSceneManifest.UIApplicationSupportsMultipleScenes).toBe(false);
  });

  it("makes the SDK 57 app delegate a factory provider that no longer creates its own window", () => {
    const adopted = adoptSceneLifecycle(template);
    expect(adopted).toContain(
      "class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {",
    );
    expect(adopted).not.toContain("UIWindow(frame: UIScreen.main.bounds)");
    expect(adopted).not.toContain("factory.startReactNative(");
    // The factory is still created at launch — the scene delegate reads it from the provider.
    expect(adopted).toContain("reactNativeFactory = factory");
    expect(adopted).toContain("var window: UIWindow?");
  });

  it("is idempotent", () => {
    const once = adoptSceneLifecycle(template);
    expect(adoptSceneLifecycle(once)).toBe(once);
  });

  it("fails the prebuild when the template has drifted", () => {
    expect(() => adoptSceneLifecycle("class AppDelegate: Something {}")).toThrow(
      /no longer matches Expo SDK 57/,
    );
  });
});
