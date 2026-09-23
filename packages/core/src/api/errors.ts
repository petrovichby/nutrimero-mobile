import type { components } from "./generated/schema";

export type ApiErrorCode = components["schemas"]["ErrorResponse"]["error"]["code"];

export type ErrorKind =
  | "unauthorized"
  | "insufficientRole"
  | "notFound"
  | "companyArchived"
  | "membershipLost"
  | "companyContextRequired"
  | "validation"
  | "conflict"
  | "rateLimited"
  | "server"
  | "network"
  | "unknown";

export interface ClassifiedError {
  readonly kind: ErrorKind;
  readonly status: number | null;
  readonly code: ApiErrorCode | null;
  readonly details: Readonly<Record<string, unknown>>;
}

/**
 * Exhaustive over the contract's error codes (002 pinned fact P5): a code the api adds fails
 * typecheck here, so drift surfaces in CI, not as an unclassified error in a user's hands.
 */
const KIND_BY_CODE: Record<ApiErrorCode, ErrorKind> = {
  AUTHENTICATION_FAILED: "unauthorized",
  TOKEN_INVALID: "unauthorized",
  REFRESH_TOKEN_INVALID: "unauthorized",
  ACCOUNT_ERASED: "unauthorized",
  EMAIL_ALREADY_REGISTERED: "conflict",
  PASSWORD_TOO_WEAK: "validation",
  RESET_TOKEN_INVALID: "validation",
  COMPANY_CONTEXT_REQUIRED: "companyContextRequired",
  MEMBERSHIP_REQUIRED: "membershipLost",
  MEMBERSHIP_NOT_ACTIVE: "membershipLost",
  INSUFFICIENT_ROLE: "insufficientRole",
  NOT_FOUND: "notFound",
  COMPANY_ARCHIVED: "companyArchived",
  LAST_ADMIN: "conflict",
  ALREADY_MEMBER: "conflict",
  INVITATION_INVALID: "validation",
  JOIN_CODE_INVALID: "validation",
  REQUEST_NOT_PENDING: "conflict",
  BARCODE_ALREADY_REGISTERED: "conflict",
  PURCHASED_ITEM_BARCODE_TAKEN: "conflict",
  UNIT_NOT_PACKAGEABLE: "validation",
  WEIGHT_PER_PACKAGE_REQUIRED: "validation",
  VALUE_NOT_OVERRIDABLE: "validation",
  OVERRIDE_NOT_ACTIVE: "conflict",
  NO_SUCCESSOR: "conflict",
  SUCCESSOR_CHANGED: "conflict",
  VENDOR_NAME_TAKEN: "conflict",
  PRICE_NOT_ACTIVE: "conflict",
  PRICE_CHANGED: "conflict",
  COMPONENT_TARGET_INVALID: "validation",
  RECIPE_NESTING_REFUSED: "validation",
  RECIPE_ACTION_UNKNOWN: "validation",
  RECIPE_CODE_TAKEN: "conflict",
  PRODUCT_NUMBER_TAKEN: "conflict",
  DECLARATION_INCOMPLETE: "conflict",
  VALIDATION_FAILED: "validation",
  RATE_LIMITED: "rateLimited",
  INTERNAL_ERROR: "server",
};

function kindForStatus(status: number): ErrorKind {
  if (status === 401) return "unauthorized";
  if (status === 403) return "insufficientRole";
  if (status === 404) return "notFound";
  if (status === 409) return "conflict";
  if (status === 422) return "validation";
  if (status === 429) return "rateLimited";
  if (status >= 500) return "server";
  return "unknown";
}

function isKnownCode(code: unknown): code is ApiErrorCode {
  return typeof code === "string" && Object.hasOwn(KIND_BY_CODE, code);
}

function field(value: unknown, name: string): unknown {
  if (typeof value !== "object" || value === null || !(name in value)) {
    return undefined;
  }
  return Reflect.get(value, name);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Classifies a non-2xx response: the envelope's code decides; the status is the fallback. */
export function classifyResponseError(status: number, body: unknown): ClassifiedError {
  const error = field(body, "error");
  const code = field(error, "code");
  const rawDetails = field(error, "details");
  const details = isRecord(rawDetails) ? rawDetails : {};

  if (isKnownCode(code)) {
    return { kind: KIND_BY_CODE[code], status, code, details };
  }
  return { kind: kindForStatus(status), status, code: null, details };
}

/** A thrown fetch (no response at all) is the network being unavailable. */
export function classifyThrown(): ClassifiedError {
  return { kind: "network", status: null, code: null, details: {} };
}
