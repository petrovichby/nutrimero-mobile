import createClient from "openapi-fetch";
import type { paths } from "./generated/schema";

export type ApiClient = ReturnType<typeof createClient<paths>>;

export interface ApiClientOptions {
  /** Injected in tests; defaults to the platform `fetch`. */
  fetch?: (input: Request) => Promise<Response>;
}

/**
 * Typed client over the committed contract snapshot (Constitution II).
 * The base URL is injected by the app (Expo public env), never hardcoded here.
 */
export function createApiClient(baseUrl: string, options: ApiClientOptions = {}): ApiClient {
  return createClient<paths>({ baseUrl, ...options });
}
