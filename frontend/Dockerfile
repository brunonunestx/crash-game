FROM oven/bun:1-alpine

WORKDIR /app

# Monorepo root workspace
COPY package.json bun.lock ./
COPY packages/ packages/

# Frontend manifest first (layer cache)
COPY frontend/package.json frontend/package.json

RUN bun install

COPY frontend/ frontend/

WORKDIR /app/frontend

# VITE_* vars are baked into the bundle at build time
ARG VITE_KEYCLOAK_URL=http://localhost:8080
ARG VITE_KEYCLOAK_REALM=crash-game
ARG VITE_KEYCLOAK_CLIENT_ID=crash-game-client
ARG VITE_API_URL=http://localhost:8000

ENV VITE_KEYCLOAK_URL=$VITE_KEYCLOAK_URL
ENV VITE_KEYCLOAK_REALM=$VITE_KEYCLOAK_REALM
ENV VITE_KEYCLOAK_CLIENT_ID=$VITE_KEYCLOAK_CLIENT_ID
ENV VITE_API_URL=$VITE_API_URL

COPY frontend/serve.mjs serve.mjs

RUN bun run build

EXPOSE 3000

CMD ["bun", "serve.mjs"]
