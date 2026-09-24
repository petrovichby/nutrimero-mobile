import { LanguageScreen } from "@nutrimero/feature-first-run";
import { router } from "expo-router";
import { useShell } from "../src/shell";

/**
 * More → Language (MA-22). A choice applies in place and the mark moves; the user leaves with
 * back, as from any pushed screen.
 */
export default function LanguageRoute() {
  const { t, locale, deviceLocale, chooseLocale } = useShell();
  return (
    <LanguageScreen
      t={t}
      current={locale}
      deviceLocale={deviceLocale}
      onChoose={chooseLocale}
      onBack={() => router.back()}
    />
  );
}
