const CORS_ALLOW_METHODS = "GET, POST, OPTIONS";
const CORS_ALLOW_HEADERS = "Content-Type, Accept, X-Public-Key";
const CORS_MAX_AGE = "86400";

export function getCorsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get("origin");

  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Methods": CORS_ALLOW_METHODS,
    "Access-Control-Allow-Headers": CORS_ALLOW_HEADERS,
    "Access-Control-Max-Age": CORS_MAX_AGE,
    Vary: "Origin",
  };
}

export function corsPreflightResponse(request: Request): Response {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request),
  });
}

export function jsonWithCors(
  request: Request,
  body: unknown,
  init?: ResponseInit,
): Response {
  const headers = new Headers(init?.headers);
  const cors = getCorsHeaders(request);

  for (const [key, value] of Object.entries(cors)) {
    headers.set(key, value);
  }

  headers.set("Content-Type", "application/json; charset=utf-8");

  return new Response(JSON.stringify(body), {
    ...init,
    headers,
  });
}

export function sseWithCors(
  request: Request,
  stream: ReadableStream<Uint8Array>,
): Response {
  const headers = new Headers(getCorsHeaders(request));
  headers.set("Content-Type", "text/event-stream; charset=utf-8");
  headers.set("Cache-Control", "no-cache, no-transform");
  headers.set("Connection", "keep-alive");

  return new Response(stream, { headers });
}
