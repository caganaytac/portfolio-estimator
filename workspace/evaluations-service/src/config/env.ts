import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const booleanFromEnvironment = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  switch (value.trim().toLowerCase()) {
    case "true":
    case "1":
      return true;
    case "false":
    case "0":
      return false;
    default:
      return value;
  }
}, z.boolean());

const envSchema = z.object({
  NODE_ENV: z.enum([
    "development",
    "production",
    "test"
  ]).default("development"),

  SERVICE_NAME: z.string().default("evaluations-service"),
  PORT: z.coerce.number().default(3003),
  LOG_LEVEL: z.enum([
    "fatal",
    "error",
    "warn",
    "info",
    "debug",
    "trace"
  ]).default("info"),

  DB_TYPE: z.enum([
    "postgres"
  ]).default("postgres"),
  POSTGRES_HOST: z.string().default("localhost"),
  POSTGRES_PORT: z.coerce.number().default(5432),
  POSTGRES_DB: z.string().default("EvaluationsDB"),
  POSTGRES_USER: z.string().default("postgres"),
  POSTGRES_PASSWORD: z.string().default("postgres"),
  POSTGRES_SSL: booleanFromEnvironment.default(false),
  POSTGRES_POOL_MAX: z.coerce.number().int().positive().default(10),
  DB_SCHEMA: z.string().default("public"),
  DB_SYNCHRONIZE: booleanFromEnvironment.optional(),

  PORTFOLIOS_SERVICE_URL: z.string().url().default("http://localhost:3002"),
  PORTFOLIOS_SERVICE_TIMEOUT_MS: z.coerce.number().int().positive().default(5000),

  OPENAI_API_KEY: z.string().trim().min(1, "OPENAI_API_KEY cannot be empty").optional(),
  OPENAI_MODEL: z.string().trim().min(1, "OPENAI_MODEL cannot be empty").default("gpt-5"),

  JWT_SECRET: z.string().min(10).optional(),
  JWT_EXPIRES_IN: z.string().default("15m"),
  REFRESH_TOKEN_TTL_SECONDS: z.coerce.number().default(60 * 60 * 24 * 7),
  REFRESH_TOKEN_SECRET: z.string().min(32).optional(),

  BCRYPT_ROUNDS: z.coerce.number().min(8).max(14).default(12),
  PASSWORD_MIN_LENGTH: z.coerce.number().min(8).max(128).default(12),
  MAX_LOGIN_ATTEMPTS: z.coerce.number().min(3).max(20).default(5)
});

export type Env = z.infer<typeof envSchema>;

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables", parsed.error.format());
  process.exit(1);
}


export const env: Env = parsed.data;
