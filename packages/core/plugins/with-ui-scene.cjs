// Expo config plugin: adopt the iOS UIScene life cycle (required by iOS 27) in both apps.
// The transforms live in ../src/native-config/ui-scene.ts (tested); Node 22 strips its types.
// Expo's own helpers are resolved from the app's project root — the app, not this package,
// depends on `expo`.
const { adoptSceneLifecycle, withSceneManifest } = require("../src/native-config/ui-scene.ts");

module.exports = function withUiScene(config) {
  const projectRoot = config._internal?.projectRoot ?? process.cwd();
  const { withAppDelegate, withInfoPlist } = require(
    require.resolve("expo/config-plugins", { paths: [projectRoot] }),
  );
  const withPlist = withInfoPlist(config, (next) => {
    next.modResults = withSceneManifest(next.modResults);
    return next;
  });
  return withAppDelegate(withPlist, (next) => {
    if (next.modResults.language !== "swift") {
      throw new Error("with-ui-scene: expected a Swift AppDelegate (Expo SDK 57 template)");
    }
    next.modResults.contents = adoptSceneLifecycle(next.modResults.contents);
    return next;
  });
};
