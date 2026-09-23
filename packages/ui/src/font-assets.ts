/// <reference path="./assets.d.ts" />
import onest400 from "../assets/fonts/Onest_400Regular.ttf";
import onest500 from "../assets/fonts/Onest_500Medium.ttf";
import onest600 from "../assets/fonts/Onest_600SemiBold.ttf";
import onest700 from "../assets/fonts/Onest_700Bold.ttf";
import onest800 from "../assets/fonts/Onest_800ExtraBold.ttf";
import pacifico400 from "../assets/fonts/Pacifico_400Regular.ttf";
import jakarta400 from "../assets/fonts/PlusJakartaSans_400Regular.ttf";
import jakarta500 from "../assets/fonts/PlusJakartaSans_500Medium.ttf";
import jakarta600 from "../assets/fonts/PlusJakartaSans_600SemiBold.ttf";
import jakarta700 from "../assets/fonts/PlusJakartaSans_700Bold.ttf";
import jakarta800 from "../assets/fonts/PlusJakartaSans_800ExtraBold.ttf";
import stardos700 from "../assets/fonts/StardosStencil_700Bold.ttf";
import yeseva400 from "../assets/fonts/YesevaOne_400Regular.ttf";
import type { FontName } from "./fonts";

/**
 * Every registered face's bundled file, for `expo-font`'s `useFonts` / `loadAsync`. Typed as a
 * complete record, so a face added to the registry without its file fails typecheck.
 */
export const fontAssets: Record<FontName, number> = {
  "PlusJakartaSans-400": jakarta400,
  "PlusJakartaSans-500": jakarta500,
  "PlusJakartaSans-600": jakarta600,
  "PlusJakartaSans-700": jakarta700,
  "PlusJakartaSans-800": jakarta800,
  "Onest-400": onest400,
  "Onest-500": onest500,
  "Onest-600": onest600,
  "Onest-700": onest700,
  "Onest-800": onest800,
  "Pacifico-400": pacifico400,
  "StardosStencil-700": stardos700,
  "YesevaOne-400": yeseva400,
};
