FROM oven/bun:1 AS builder

# Etapa de construcción: instala dependencias del monorepo y prepara el backend de Elysia

WORKDIR /app

# Dependencias del sistema mínimas (ej. TLS para Postgres)
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    openssl \
 && rm -rf /var/lib/apt/lists/*

# Copiamos los manifests necesarios para resolver el workspace
COPY package.json bun.lock* turbo.json ./

# Copiamos los package.json de los paquetes que usa el backend
COPY packages/api/package.json ./packages/api/package.json
COPY packages/database/package.json ./packages/database/package.json
COPY packages/auth/package.json ./packages/auth/package.json
COPY packages/eslint-config/package.json ./packages/eslint-config/package.json
COPY apps/backend_worker/package.json ./apps/backend_worker/package.json

# Instalamos dependencias del workspace (usa bun.lock*)
RUN bun install

# Ahora copiamos el código fuente necesario para el backend de Elysia
COPY packages/api ./packages/api
COPY packages/database ./packages/database
COPY packages/auth ./packages/auth
COPY apps/backend_worker ./apps/backend_worker

ENV NODE_ENV=production

# Etapa de runtime: imagen ligera que solo contiene lo necesario para correr el servidor
FROM oven/bun:1

WORKDIR /app

RUN apt-get update -y && apt-get install -y --no-install-recommends \
    openssl \
 && rm -rf /var/lib/apt/lists/*

# Copiamos dependencias ya instaladas
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bun.lock* ./
COPY --from=builder /app/node_modules ./node_modules

# Copiamos solo el código que usa el backend
COPY --from=builder /app/apps/backend_worker ./apps/backend_worker
COPY --from=builder /app/packages/api ./packages/api
COPY --from=builder /app/packages/database ./packages/database
COPY --from=builder /app/packages/auth ./packages/auth

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

# Ejecuta directamente el servidor de Elysia con Bun (TypeScript soportado nativamente)
CMD ["bun", "run", "apps/backend_worker/src/index.ts"]


