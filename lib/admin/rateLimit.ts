/**
 * Tiny fixed-window rate limiter — SERVER ONLY.
 *
 * In-memory and per serverless instance, so it is a brute-force speed bump,
 * not a global guarantee. Good enough for a two-person admin behind
 * email + PIN + TOTP; swap for Upstash if the panel ever grows.
 */

const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, opts: { windowMs: number; max: number }): boolean {
  const now = Date.now();
  const hit = buckets.get(key);

  if (!hit || now > hit.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
    if (buckets.size > 5000) {
      for (const [k, v] of buckets) if (now > v.resetAt) buckets.delete(k);
    }
    return true;
  }

  hit.count += 1;
  return hit.count <= opts.max;
}

export function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}
