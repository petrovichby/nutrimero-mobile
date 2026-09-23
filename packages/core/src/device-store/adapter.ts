/**
 * The one device key/value store both apps share (ADR 0001, secure-store conditions). The
 * adapter is the only thing that touches the platform store; everything above it is tested
 * against `createMemoryAdapter`.
 */
export interface DeviceStoreAdapter {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
}

/** ADR 0001 condition 5: the design budget per value, in UTF-8 bytes. */
export const VALUE_BUDGET_BYTES = 2048;

/** ADR 0001 condition 6: SDK 57's key constraint — alphanumerics, `.`, `-`, `_` only. */
const KEY_PATTERN = /^[A-Za-z0-9._-]+$/;

export function assertValidKey(key: string): string {
  if (!KEY_PATTERN.test(key)) {
    throw new Error(`Device store key "${key}" uses characters outside [A-Za-z0-9._-]`);
  }
  return key;
}

/** UTF-8 length without platform APIs, so the budget check runs identically everywhere. */
export function utf8ByteLength(value: string): number {
  let bytes = 0;
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    bytes += code < 0x80 ? 1 : code < 0x800 ? 2 : code < 0x10000 ? 3 : 4;
  }
  return bytes;
}

export function assertWithinBudget(key: string, value: string): string {
  const bytes = utf8ByteLength(value);
  if (bytes > VALUE_BUDGET_BYTES) {
    // Key name only — values are never logged or echoed (ADR 0001 condition 4).
    throw new Error(
      `Device store value for "${key}" is ${bytes} bytes, over the ${VALUE_BUDGET_BYTES}-byte budget`,
    );
  }
  return value;
}

/** In-memory adapter for tests and fakes; enforces the same key and budget rules. */
export function createMemoryAdapter(initial: Record<string, string> = {}): DeviceStoreAdapter & {
  snapshot(): Record<string, string>;
} {
  const values = new Map(Object.entries(initial));
  return {
    async get(key) {
      return values.get(assertValidKey(key)) ?? null;
    },
    async set(key, value) {
      values.set(assertValidKey(key), assertWithinBudget(key, value));
    },
    async delete(key) {
      values.delete(assertValidKey(key));
    },
    snapshot() {
      return Object.fromEntries(values);
    },
  };
}
