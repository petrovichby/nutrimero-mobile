import { type ClassifiedError, classifyResponseError, classifyThrown } from "@nutrimero/core";

export type Result<T> =
  | { readonly ok: true; readonly value: T; readonly serverDate: string | null }
  | { readonly ok: false; readonly error: ClassifiedError };

/** One api read: the typed body, or a classified error (a thrown fetch is the network). */
export async function attempt<T>(
  request: () => Promise<{ data?: T; error?: unknown; response: Response }>,
): Promise<Result<T>> {
  try {
    const { data, error, response } = await request();
    if (data !== undefined) {
      return { ok: true, value: data, serverDate: response.headers.get("Date") };
    }
    return { ok: false, error: classifyResponseError(response.status, error) };
  } catch {
    return { ok: false, error: classifyThrown() };
  }
}
