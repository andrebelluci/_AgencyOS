import "server-only";

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export type RateLimitConfig = {
  ipMax: number;
  ipWindowMs: number;
  publicKeyMax: number;
  publicKeyWindowMs: number;
};

export function getRateLimitConfig(): RateLimitConfig {
  return {
    ipMax: parsePositiveInt(process.env.RATE_LIMIT_IP_MAX, 60),
    ipWindowMs: parsePositiveInt(process.env.RATE_LIMIT_IP_WINDOW_MS, 60_000),
    publicKeyMax: parsePositiveInt(process.env.RATE_LIMIT_KEY_MAX, 30),
    publicKeyWindowMs: parsePositiveInt(
      process.env.RATE_LIMIT_KEY_WINDOW_MS,
      60_000,
    ),
  };
}
