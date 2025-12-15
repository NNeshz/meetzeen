import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: ["./src/schema.ts", "./src/other.ts"],
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Para migraciones, usar DIRECT_URL si está disponible (requerido para operaciones DDL)
    // Pgbouncer (puerto 6543) no soporta CREATE SCHEMA y otras operaciones DDL
    url: process.env.DIRECT_URL || process.env.DATABASE_URL!,
  },
});

