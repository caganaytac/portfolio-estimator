import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  SERVICE_NAME: z.string().default("users-service"),
  PORT: z.coerce.number().default(3001),

  DB_TYPE: z.enum(["postgres"]).default("postgres"),

  POSTGRES_HOST: z.string().default("localhost"),
  POSTGRES_PORT: z.coerce.number().default(5432),
  POSTGRES_DB: z.string().default("users"),
  POSTGRES_USER: z.string().default("postgres"),
  POSTGRES_PASSWORD: z.string().default("postgres"),
  POSTGRES_SSL: z.coerce.boolean().default(false),
  DB_SCHEMA: z.string().default("public"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
  
  JWT_SECRET: z.string().min(10, "JWT_SECRET must be at least 10 characters").default("change-me-please"),
  JWT_EXPIRES_IN: z.string().default("15m"),
  REFRESH_TOKEN_TTL_SECONDS: z.coerce.number().default(60 * 60 * 24 * 7),
  
  BCRYPT_ROUNDS: z.coerce.number().min(8).max(14).default(12),
  PASSWORD_MIN_LENGTH: z.coerce.number().min(8).max(128).default(12),
  MAX_LOGIN_ATTEMPTS: z.coerce.number().min(3).max(20).default(5),
});

export type Env = z.infer<typeof envSchema>;

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables", parsed.error.format());
  process.exit(1);
}

export const env: Env = parsed.data;
