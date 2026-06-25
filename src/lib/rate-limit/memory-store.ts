import "server-only";

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

const MAX_BUCKETS = 10_000;

function pruneExpired(now: number): void {
  if (buckets.size <= MAX_BUCKETS) {
    return;
  }

  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

export function incrementBucket(
  key: string,
  windowMs: number,
): { count: number; limit: number; resetAt: number } {
  const now = Date.now();
  pruneExpired(now);

  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { count: 1, limit: 0, resetAt };
  }

  existing.count += 1;
  buckets.set(key, existing);

  return {
    count: existing.count,
    limit: 0,
    resetAt: existing.resetAt,
  };
}

export function resetRateLimitStore(): void {
  buckets.clear();
}
