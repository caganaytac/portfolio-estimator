import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../models/user";
import { Corporate } from "../models/corporate";
import { Person } from "../models/person";
import { env } from "./env";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  username: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
  schema: env.DB_SCHEMA,
  ssl: env.POSTGRES_SSL ? { rejectUnauthorized: false } : false,
  synchronize: false,
  logging: env.NODE_ENV === "development",
  entities: [User, Corporate, Person],
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
