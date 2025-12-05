import { PrismaClient } from "@meetzeen/database";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 50,
  min: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000,
  statement_timeout: 60000,
});

const adapter = new PrismaPg(pool);

export const _prisma = new PrismaClient({ adapter });