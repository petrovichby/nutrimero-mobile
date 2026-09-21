import createClient from "openapi-fetch";
import type { paths } from "./generated/schema";

export type ApiClient = ReturnType<typeof createClient<paths>>;

/**
 * Typed client over the committed contract snapshot (Constitution II).
 * The base URL is injected by the app (Expo public env), never hardcoded here.
 */
export function createApiClient(baseUrl: string): ApiClient {
  return createClient<paths>({ baseUrl });
}
