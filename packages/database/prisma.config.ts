import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

// Helper to convert pgbouncer URL to direct connection URL
function getDirectUrl(): string {
  const directUrl = env('DIRECT_URL')
  if (directUrl) return directUrl

  const dbUrl = env('DATABASE_URL')
  // Return a dummy URL if DATABASE_URL is not set (e.g., during prisma generate)
  if (!dbUrl) return 'postgresql://dummy:dummy@localhost:5432/dummy'

  // If using pgbouncer (port 6543), convert to direct connection (port 5432)
  if (dbUrl.includes(':6543')) {
    return dbUrl
      .replace(':6543', ':5432')
      .replace(/[?&]pgbouncer=true/, '')
      .replace(/[?&]pgbouncer=false/, '')
  }

  return dbUrl
}

export default defineConfig({
  schema: 'prisma/schema',
  migrations: {
    path: 'prisma/schema/migrations',
    seed: 'bun prisma/seed.ts',
  },
  datasource: {
    url: getDirectUrl(),
  },
})

