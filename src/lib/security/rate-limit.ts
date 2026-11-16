interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory store for single-instance / MVP deployments.
// Upgrade note: For multi-instance, serverless or edge deployments across multiple regions,
// swap this with an Upstash Redis store (@upstash/ratelimit).
const memoryStore = new Map<string, RateLimitRecord>();

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export function checkRateLimit(
  key: string,
  config: RateLimitConfig,
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = memoryStore.get(key);

  if (!record || now > record.resetAt) {
    const nextRecord: RateLimitRecord = {
      count: 1,
      resetAt: now + config.windowMs,
    };
    memoryStore.set(key, nextRecord);
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: nextRecord.resetAt,
    };
  }

  if (record.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: record.resetAt,
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetAt: record.resetAt,
  };
}

export function resetRateLimit(key: string): void {
  memoryStore.delete(key);
}
