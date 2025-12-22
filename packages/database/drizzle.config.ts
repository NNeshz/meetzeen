import { defineConfig } from "drizzle-kit";
import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnvFile() {
  let currentDir = process.cwd();
  const maxDepth = 5;
  
  for (let i = 0; i < maxDepth; i++) {
    try {
      const envPath = resolve(currentDir, ".env");
      const envFile = readFileSync(envPath, "utf-8");
      const envLines = envFile.split("\n");
      
      for (const line of envLines) {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith("#")) {
          const [key, ...valueParts] = trimmedLine.split("=");
          if (key && valueParts.length > 0) {
            const value = valueParts.join("=").replace(/^["']|["']$/g, "");
            if (!process.env[key]) {
              process.env[key] = value;
            }
          }
        }
      }
      return;
    } catch {
      currentDir = resolve(currentDir, "..");
    }
  }
}

loadEnvFile();

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

