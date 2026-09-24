import { ComingSoon } from "@nutrimero/feature-home-shell";
import { router } from "expo-router";
import { useShell } from "../../src/shell";

export default function BuilderTab() {
  const { t } = useShell();
  return <ComingSoon t={t} tab="builder" onBack={() => router.navigate("/")} />;
}
