import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "./env";
import { Asset } from "../models/asset";
import { Holding } from "../models/holding";
import { Portfolio } from "../models/portfolio";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  username: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
  schema: env.DB_SCHEMA,
  ssl: env.POSTGRES_SSL ? { rejectUnauthorized: false } : false,
  synchronize: true,
  logging: env.NODE_ENV === "development",
  entities: [Asset, Holding, Portfolio],
});

export const initializeDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  } catch (error) {
    console.error("❌ Database connection error:", error);
    throw error;
  }
};
