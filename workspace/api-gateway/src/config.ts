import "dotenv/config";

function positiveInteger(name: string, fallback: number): number {
  const raw = process.env[name];

  if (raw === undefined || raw.trim() === "") {
    return fallback;
  }

  const value = Number(raw);

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }

  return value;
}

function serviceUrl(name: string, fallback: string): string {
  const raw = process.env[name]?.trim() || fallback;
  const url = new URL(raw);

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`${name} must use http or https`);
  }

  return url.toString().replace(/\/$/, "");
}

const jwtSecret = process.env.JWT_SECRET?.trim();

if (!jwtSecret) {
  throw new Error("JWT_SECRET is required by the API gateway");
}

export const config = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: positiveInteger("PORT", 3000),
  jwtSecret,
  requestTimeoutMs: positiveInteger("REQUEST_TIMEOUT_MS", 5000),
  bodyLimit: process.env.BODY_LIMIT?.trim() || "1mb",
  trustProxy: process.env.TRUST_PROXY === "true",
  corsOrigins: (process.env.CORS_ORIGINS ?? "*")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  rateLimit: {
    windowMs: positiveInteger("RATE_LIMIT_WINDOW_MS", 60_000),
    max: positiveInteger("RATE_LIMIT_MAX", 200)
  },
  services: {
    users: serviceUrl("USERS_SERVICE_URL", "http://localhost:3001"),
    portfolios: serviceUrl("PORTFOLIOS_SERVICE_URL", "http://localhost:3002"),
    evaluations: serviceUrl("EVALUATIONS_SERVICE_URL", "http://localhost:3003")
  }
} as const;
