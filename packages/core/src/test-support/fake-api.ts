/**
 * A scripted stand-in for nutrimero-api in unit tests: routes by "METHOD /path" and records every
 * request. Bodies are shaped by the tests against the generated types; nothing here is shipped.
 */
export type Handler = (request: Request) => Response | Promise<Response>;

export const BASE_URL = "https://api.test";

export function json(status: number, body: unknown): Response {
  return new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function errorBody(code: string, details: Record<string, unknown> = {}): unknown {
  return { error: { code, details } };
}

export function createFakeApi(routes: Record<string, Handler | Handler[]>) {
  const calls: { method: string; path: string; authorization: string | null; body: unknown }[] = [];
  const queues = new Map<string, Handler[]>();
  for (const [route, handler] of Object.entries(routes)) {
    queues.set(route, Array.isArray(handler) ? [...handler] : [handler]);
  }

  async function fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const route = `${request.method} ${url.pathname}`;
    const text = request.method === "GET" ? "" : await request.clone().text();
    calls.push({
      method: request.method,
      path: url.pathname,
      authorization: request.headers.get("Authorization"),
      body: text === "" ? undefined : JSON.parse(text),
    });
    const queue = queues.get(route);
    const handler = queue !== undefined && queue.length > 1 ? queue.shift() : queue?.[0];
    if (handler === undefined) {
      return json(404, errorBody("NOT_FOUND"));
    }
    return handler(request);
  }

  return { fetch, calls };
}
