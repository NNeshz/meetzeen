import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import * as otherSchema from "./other";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 50,
  min: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000,
  statement_timeout: 60000,
  allowExitOnIdle: false,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

pool.on("connect", (client) => {
  client.on("error", (err) => {
    console.error("Unexpected error on client", err);
  });
});

const mergedSchema = {
  ...schema,
  ...otherSchema,
};

export const db = drizzle(pool, { schema: mergedSchema });

export type Database = typeof db;

