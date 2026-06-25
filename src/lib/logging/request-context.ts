import "server-only";

import { randomUUID } from "node:crypto";

import { logStructured } from "./structured";

const REQUEST_ID_HEADER = "x-request-id";

export type RequestLogContext = {
  requestId: string;
  route: string;
  tenantId: string | null;
  startedAt: number;
};

export function createRequestLogContext(
  request: Request,
  route: string,
  tenantId: string | null = null,
): RequestLogContext {
  const fromHeader = request.headers.get(REQUEST_ID_HEADER)?.trim();
  const requestId = fromHeader || randomUUID();

  return {
    requestId,
    route,
    tenantId,
    startedAt: Date.now(),
  };
}

export function logRequestStart(ctx: RequestLogContext): void {
  logStructured({
    level: "info",
    message: "request_started",
    request_id: ctx.requestId,
    tenant_id: ctx.tenantId,
    route: ctx.route,
  });
}

export function logRequestEnd(
  ctx: RequestLogContext,
  status: number,
  extra?: Record<string, unknown>,
): void {
  logStructured({
    level: status >= 500 ? "error" : "info",
    message: "request_completed",
    request_id: ctx.requestId,
    tenant_id: ctx.tenantId,
    route: ctx.route,
    duration_ms: Date.now() - ctx.startedAt,
    status,
    ...extra,
  });
}

export function withRequestIdHeader(
  response: Response,
  requestId: string,
): Response {
  const headers = new Headers(response.headers);
  headers.set(REQUEST_ID_HEADER, requestId);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
