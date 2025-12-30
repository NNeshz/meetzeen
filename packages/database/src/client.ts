import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import type { PoolConfig } from "pg";
import * as schema from "./schema";
import * as otherSchema from "./other";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL or DIRECT_URL environment variable is not set");
}

const isProduction = process.env.NODE_ENV === "production" || process.env.FLY_APP_NAME;

const hasSSLInUrl = connectionString.includes("sslmode=") || connectionString.includes("ssl=");

const poolConfig: PoolConfig = {
  connectionString,
  max: 10,
  min: 1,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  statement_timeout: 30000,
  allowExitOnIdle: false,
};

if (isProduction && !hasSSLInUrl) {
  poolConfig.ssl = { rejectUnauthorized: false };
}

export const pool = new Pool(poolConfig);

pool.on("error", (err) => {
  console.error("[DB Pool] Unexpected error on idle client:", err.message, err.stack);
});

pool.on("connect", (client) => {
  console.log("[DB Pool] Client connected");
  client.on("error", (err) => {
    console.error("[DB Client] Unexpected error:", err.message, err.stack);
  });
});

const mergedSchema = {
  ...schema,
  ...otherSchema,
};

export const db = drizzle(pool, { 
  schema: mergedSchema,
});

export type Database = typeof db;

