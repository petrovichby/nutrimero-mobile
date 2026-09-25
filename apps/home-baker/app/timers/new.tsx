import { NewTimerScreen } from "@nutrimero/feature-timers/screens";
import { router } from "expo-router";
import { timersRoutes } from "../../src/timers-root";

/** New timer (17), with the permission moment on the first start (17b). */
export default function NewTimerRoute() {
  return (
    <NewTimerScreen
      onBack={() => router.back()}
      onStarted={(id) => router.replace(timersRoutes.item(id))}
    />
  );
}
