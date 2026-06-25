import "server-only";

import { jsonWithCors } from "@/lib/api/cors";
import { PUBLIC_API_ERRORS } from "@/lib/api/public-error";
import {
  createRequestLogContext,
  logRequestEnd,
  logRequestStart,
  withRequestIdHeader,
  type RequestLogContext,
} from "@/lib/logging";
import { checkPublicRateLimit } from "@/lib/rate-limit";

export function beginPublicApiRequest(
  request: Request,
  route: string,
  options?: { publicKey?: string | null; tenantId?: string | null },
):
  | { ok: true; ctx: RequestLogContext }
  | { ok: false; response: Response } {
  const rateLimit = checkPublicRateLimit(request, options?.publicKey);

  if (!rateLimit.allowed) {
    const ctx = createRequestLogContext(
      request,
      route,
      options?.tenantId ?? null,
    );
    logRequestStart(ctx);
    logRequestEnd(ctx, 429, { rate_limit_scope: rateLimit.scope });

    const response = jsonWithCors(
      request,
      { error: PUBLIC_API_ERRORS.rateLimited },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      },
    );

    return {
      ok: false,
      response: withRequestIdHeader(response, ctx.requestId),
    };
  }

  const ctx = createRequestLogContext(
    request,
    route,
    options?.tenantId ?? null,
  );
  logRequestStart(ctx);

  return { ok: true, ctx };
}

export function finishPublicApiResponse(
  request: Request,
  ctx: RequestLogContext,
  response: Response,
  status?: number,
  extra?: Record<string, unknown>,
): Response {
  logRequestEnd(ctx, status ?? response.status, extra);
  return withRequestIdHeader(response, ctx.requestId);
}
