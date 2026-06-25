import "server-only";

import { logError } from "@/lib/logging";

export function isProductionEnv(): boolean {
  return process.env.NODE_ENV === "production";
}

export function getPublicErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (!isProductionEnv() && error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function logPublicApiError(
  route: string,
  error: unknown,
  context?: {
    requestId?: string;
    tenantId?: string | null;
  },
): void {
  logError("public_api_error", error, {
    route,
    request_id: context?.requestId,
    tenant_id: context?.tenantId ?? null,
  });
}

export const PUBLIC_API_ERRORS = {
  generic: "An unexpected error occurred. Please try again later.",
  chatFailed: "Failed to process chat message.",
  widgetConfigFailed: "Failed to load widget configuration.",
  streamFailed: "The assistant is temporarily unavailable. Please try again.",
  rateLimited: "Too many requests. Please try again later.",
} as const;
