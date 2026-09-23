import { describe, expect, it } from "vitest";
import { SESSION_KEYS } from "../session/keys";
import {
  assertValidKey,
  assertWithinBudget,
  createMemoryAdapter,
  utf8ByteLength,
  VALUE_BUDGET_BYTES,
} from "./adapter";

describe("the shared device-store rules (ADR 0001 conditions 5 and 6)", () => {
  it("accepts SDK 57's key alphabet and refuses anything else", () => {
    expect(assertValidKey("nutrimero.session.userId")).toBe("nutrimero.session.userId");
    expect(() => assertValidKey("nutrimero session")).toThrow();
    expect(() => assertValidKey("nutrimero/session")).toThrow();
    expect(() => assertValidKey("")).toThrow();
  });

  it("measures UTF-8 bytes, not UTF-16 units", () => {
    expect(utf8ByteLength("abc")).toBe(3);
    expect(utf8ByteLength("ž")).toBe(2);
    expect(utf8ByteLength("€")).toBe(3);
    expect(utf8ByteLength("🥐")).toBe(4);
  });

  it("refuses a value over the budget and names only the key", () => {
    const over = "x".repeat(VALUE_BUDGET_BYTES + 1);
    expect(() => assertWithinBudget("nutrimero.session.accessToken", over)).toThrow(
      /nutrimero\.session\.accessToken.*2049 bytes/,
    );
    let message = "";
    try {
      assertWithinBudget("k", over);
    } catch (error) {
      message = String(error);
    }
    expect(message).not.toContain(over);
  });

  it("keeps every session key's maximal value inside the budget", () => {
    // ADR 0001 condition 5: refresh token = randomBytes(32) base64url (43 bytes); access token =
    // HS256 JWT {sub, gen, iat, exp} ≈ 250 bytes. Asserted with generous upper bounds.
    const maximal: Record<string, string> = {
      [SESSION_KEYS.accessToken]: "x".repeat(600),
      [SESSION_KEYS.refreshToken]: "x".repeat(64),
      [SESSION_KEYS.userId]: "00000000-0000-4000-8000-000000000000",
      [SESSION_KEYS.activeCompanyId]: "00000000-0000-4000-8000-000000000000",
      [SESSION_KEYS.pendingWipe]: "1",
    };
    for (const [key, value] of Object.entries(maximal)) {
      assertValidKey(key);
      expect(utf8ByteLength(value)).toBeLessThanOrEqual(VALUE_BUDGET_BYTES);
    }
  });

  it("the memory adapter enforces the same rules as the platform one", async () => {
    const store = createMemoryAdapter();
    await store.set("a.b", "1");
    expect(await store.get("a.b")).toBe("1");
    await store.delete("a.b");
    expect(await store.get("a.b")).toBeNull();
    await expect(store.set("bad key", "1")).rejects.toThrow();
    await expect(store.set("k", "x".repeat(VALUE_BUDGET_BYTES + 1))).rejects.toThrow();
  });
});
