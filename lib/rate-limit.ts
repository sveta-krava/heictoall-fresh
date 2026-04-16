type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

export function getClientIp(request: Request): string {
  const xRealIp = request.headers.get('x-real-ip');
  if (xRealIp) return xRealIp.trim();

  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }

  return 'unknown';
}

export function applyRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    const next: RateLimitEntry = {
      count: 1,
      resetAt: now + windowMs,
    };
    store.set(key, next);

    return {
      allowed: true,
      remaining: limit - 1,
      resetAt: next.resetAt,
    };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  existing.count += 1;
  store.set(key, existing);

  return {
    allowed: true,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
  };
}

let cleanupStarted = false;

export function startRateLimitCleanup(intervalMs = 5 * 60 * 1000) {
  if (cleanupStarted) return;
  cleanupStarted = true;

  setInterval(() => {
    const now = Date.now();

    for (const [key, entry] of store.entries()) {
      if (entry.resetAt <= now) {
        store.delete(key);
      }
    }
  }, intervalMs).unref?.();
}