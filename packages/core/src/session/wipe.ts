import type { DeviceStoreAdapter } from "../device-store/adapter";
import type { WipeOutcome } from "../device-store/fresh-install";

export type Wiper = () => Promise<void>;

export interface WipeSequence {
  /** Apps register at start-up; names must be unique. Returns an unregister function. */
  register(name: string, wiper: Wiper): () => void;
  /** 002 plan R10: mark pending → core's own keys → each wiper in order, isolated → clear mark. */
  run(): Promise<WipeOutcome>;
  isPending(): Promise<boolean>;
}

export const CORE_WIPER_NAME = "core.session";

export function createWipeSequence(
  adapter: DeviceStoreAdapter,
  ownKeys: readonly string[],
  pendingKey: string,
): WipeSequence {
  const wipers: { name: string; wiper: Wiper }[] = [];

  return {
    register(name, wiper) {
      if (name === CORE_WIPER_NAME || wipers.some((entry) => entry.name === name)) {
        throw new Error(`A wiper named "${name}" is already registered`);
      }
      const entry = { name, wiper };
      wipers.push(entry);
      return () => {
        const index = wipers.indexOf(entry);
        if (index >= 0) {
          wipers.splice(index, 1);
        }
      };
    },

    async run() {
      await adapter.set(pendingKey, "1");
      const failed: string[] = [];

      try {
        for (const key of ownKeys) {
          await adapter.delete(key);
        }
      } catch {
        failed.push(CORE_WIPER_NAME);
      }

      // Snapshot: a wiper that unregisters itself mid-run must not skip its successor.
      for (const { name, wiper } of [...wipers]) {
        try {
          await wiper();
        } catch {
          failed.push(name);
        }
      }

      if (failed.length === 0) {
        await adapter.delete(pendingKey);
      }
      return { complete: failed.length === 0, failed };
    },

    async isPending() {
      return (await adapter.get(pendingKey)) !== null;
    },
  };
}
