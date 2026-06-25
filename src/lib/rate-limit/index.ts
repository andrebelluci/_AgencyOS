import "server-only";

import { getRateLimitConfig } from "./config";
import { incrementBucket } from "./memory-store";

export { getRateLimitConfig } from "./config";
export { resetRateLimitStore } from "./memory-store";

export type RateLimitResult =
  | { allowed: true }
  | {
      allowed: false;
      scope: "ip" | "public_key";
      retryAfterSeconds: number;
    };

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) {
    return realIp;
  }

  return "unknown";
}

function checkScope(
  scope: "ip" | "public_key",
  identifier: string,
  max: number,
  windowMs: number,
): RateLimitResult | null {
  const bucket = incrementBucket(`${scope}:${identifier}`, windowMs);

  if (bucket.count > max) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((bucket.resetAt - Date.now()) / 1000),
    );

    return {
      allowed: false,
      scope,
      retryAfterSeconds,
    };
  }

  return null;
}

export function checkPublicRateLimit(
  request: Request,
  publicKey?: string | null,
): RateLimitResult {
  const config = getRateLimitConfig();
  const ip = getClientIp(request);

  const ipResult = checkScope("ip", ip, config.ipMax, config.ipWindowMs);
  if (ipResult) {
    return ipResult;
  }

  if (publicKey?.trim()) {
    const keyResult = checkScope(
      "public_key",
      publicKey.trim(),
      config.publicKeyMax,
      config.publicKeyWindowMs,
    );
    if (keyResult) {
      return keyResult;
    }
  }

  return { allowed: true };
}
