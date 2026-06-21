import "reflect-metadata";
import { DataSource } from "typeorm";
import type { DataSourceOptions } from "typeorm";
import { env } from "./env";
import { EvaluationRun } from "../models/evaluation-run";
import { PortfolioEvaluation } from "../models/portfolio-evaluation";
import { PortfolioExposure } from "../models/portfolio-exposure";
import { PortfolioStressTest } from "../models/portfolio-stress-test";

const isDevelopment = env.NODE_ENV === "development";
const isTest = env.NODE_ENV === "test";
const shouldSynchronize =
  env.NODE_ENV !== "production" &&
  (env.DB_SYNCHRONIZE ?? true);

const databaseOptions: DataSourceOptions = {
  type: env.DB_TYPE,
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  username: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
  schema: env.DB_SCHEMA,
  ssl: env.POSTGRES_SSL
    ? {
        rejectUnauthorized: false
      }
    : false,

  /**
   * Keep synchronize off in production.
   *
   * TypeORM synchronize mutates the database schema automatically and can be
   * dangerous once real data exists. Use migrations for production changes.
   */
  synchronize: shouldSynchronize,
  migrationsRun: false,

  logging: isDevelopment
    ? [
        "query",
        "error",
        "warn",
        "schema"
      ]
    : [
        "error",
        "warn"
      ],

  entities: [
    EvaluationRun,
    PortfolioEvaluation,
    PortfolioExposure,
    PortfolioStressTest
  ],

  extra: {
    application_name: env.SERVICE_NAME,
    max: isTest ? 1 : env.POSTGRES_POOL_MAX,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
  }
};

export const AppDataSource = new DataSource(databaseOptions);

export const initializeDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    return AppDataSource;
  } catch (error) {
    console.error("Database connection error", {
      host: env.POSTGRES_HOST,
      port: env.POSTGRES_PORT,
      database: env.POSTGRES_DB,
      schema: env.DB_SCHEMA,
      error
    });

    throw error;
  }
};

export const closeDatabase = async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
};
