import { ClearDataSheet, MoreScreen } from "@nutrimero/feature-home-shell";
import Constants from "expo-constants";
import { router } from "expo-router";
import { useState } from "react";
import { useShell } from "../../src/shell";

export default function MoreTab() {
  const { t, locale, clearData, openTimers } = useShell();
  const [confirming, setConfirming] = useState(false);
  return (
    <>
      <MoreScreen
        t={t}
        locale={locale}
        version={Constants.expoConfig?.version ?? ""}
        onTimers={openTimers}
        onLanguage={() => router.push("/language")}
        onClearData={() => setConfirming(true)}
      />
      <ClearDataSheet
        t={t}
        visible={confirming}
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          setConfirming(false);
          clearData();
        }}
      />
    </>
  );
}
