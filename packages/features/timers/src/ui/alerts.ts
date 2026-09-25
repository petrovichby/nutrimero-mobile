import type { View } from "../model/item";

/**
 * Which endings raise the in-app alert (22, narrowed by 18c — nutrimero-design a46f00c8, owner walk
 * 2026-09-25): every ending except the one whose own screen is open. That screen turns to done in
 * place, and its own buttons do the alert's job; the sound and vibration still happen for all.
 */
export function alertsFor(ended: readonly View[], onScreen: string | null): readonly View[] {
  return ended.filter((view) => view.id !== onScreen);
}
