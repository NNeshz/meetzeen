import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import * as otherSchema from "./other";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 50,
  min: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000,
  statement_timeout: 60000,
});

export const db = drizzle(pool, { schema, ...otherSchema });

export type Database = typeof db;

