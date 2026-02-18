const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 6;
const MIN_SUBMIT_DURATION_MS = 1500;

type AttemptMap = Map<string, number[]>;

const attemptsByKey: AttemptMap = new Map();

export type GuardResult = {
  ok: boolean;
  status?: number;
  error?: string;
};

function getNow(): number {
  return Date.now();
}

function normalizeIp(ip: string): string {
  return ip.trim() || "unknown";
}

function recordAndCheckRateLimit(key: string, now: number): boolean {
  const existing = attemptsByKey.get(key) ?? [];
  const threshold = now - RATE_LIMIT_WINDOW_MS;
  const recent = existing.filter((timestamp) => timestamp >= threshold);

  recent.push(now);
  attemptsByKey.set(key, recent);

  return recent.length <= RATE_LIMIT_MAX_ATTEMPTS;
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0];
    return normalizeIp(first);
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return normalizeIp(realIp);
  }

  return "unknown";
}

export function runSubmissionGuards(params: {
  routeKey: string;
  request: Request;
  honeypotValue?: string;
  startedAt?: string;
}): GuardResult {
  const now = getNow();
  const ip = getClientIp(params.request);

  if ((params.honeypotValue || "").trim() !== "") {
    return {
      ok: false,
      status: 400,
      error: "Submission rejected.",
    };
  }

  if (params.startedAt) {
    const startedAtMs = Number(params.startedAt);
    if (!Number.isNaN(startedAtMs)) {
      const elapsed = now - startedAtMs;
      if (elapsed < MIN_SUBMIT_DURATION_MS) {
        return {
          ok: false,
          status: 400,
          error: "Submission rejected.",
        };
      }
    }
  }

  const allow = recordAndCheckRateLimit(`${params.routeKey}:${ip}`, now);
  if (!allow) {
    return {
      ok: false,
      status: 429,
      error: "Too many submissions. Please wait and try again.",
    };
  }

  return { ok: true };
}
