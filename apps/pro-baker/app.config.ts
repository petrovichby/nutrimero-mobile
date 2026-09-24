import type { ConfigContext, ExpoConfig } from "expo/config";
// A JSON file, not the TypeScript module, so this build-time config needs no transpiler for it.
import entitlements from "../../packages/core/src/entitlements/source.json";

/**
 * 002 G2-Q1: the release block is mechanical. The store profile cannot evaluate this config while
 * the entitlement adapter is the stub — store release waits for the api's entitlements (ask B8).
 */
export function assertReleasable(
  buildProfile: string | undefined,
  entitlementSource: string,
): void {
  if (buildProfile === "store" && entitlementSource !== "server") {
    throw new Error(
      "Store build refused: the entitlement adapter is the stub (packages/core/src/entitlements/source.json). " +
        "Pro Baker ships to stores only once the api serves entitlements (spec 002 FR-023, ask B8).",
    );
  }
}

export default function config({ config }: ConfigContext): ExpoConfig {
  assertReleasable(process.env.EAS_BUILD_PROFILE, entitlements.source);
  return {
    ...config,
    name: "nutrimero Pro Baker",
    slug: "nutrimero-pro-baker",
    version: "0.1.0",
    orientation: "default",
    icon: "./assets/icon.png",
    scheme: "nutrimero-pro-baker",
    userInterfaceStyle: "automatic",
    ios: {
      bundleIdentifier: "org.nutrimero.probaker",
      supportsTablet: true,
    },
    android: {
      package: "org.nutrimero.probaker",
      // ADR 0001 condition 2: no Auto Backup — restored SecureStore entries cannot be decrypted.
      allowBackup: false,
      adaptiveIcon: {
        backgroundColor: "#1b1f58",
        foregroundImage: "./assets/android-icon-foreground.png",
        backgroundImage: "./assets/android-icon-background.png",
        monochromeImage: "./assets/android-icon-monochrome.png",
      },
      predictiveBackGestureEnabled: false,
    },
    plugins: [
      // ADR 0001 condition 2: SecureStore's preferences stay out of Auto Backup even if re-enabled.
      ["expo-secure-store", { configureAndroidBackup: true, faceIDPermission: false }],
      // iOS 27 requires the UIScene life cycle (shared plugin, packages/core/plugins).
      "@nutrimero/core/plugins/with-ui-scene",
    ],
  };
}
