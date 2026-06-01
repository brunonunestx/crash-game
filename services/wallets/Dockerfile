FROM oven/bun:1-alpine

WORKDIR /app

# Monorepo root workspace
COPY package.json bun.lock ./
COPY packages/ packages/

# Service manifest first (layer cache)
COPY services/wallets/package.json services/wallets/package.json

RUN sed -i 's|"frontend",\?||g; s|,\s*"frontend"||g' package.json && bun install

# Service source
COPY services/wallets/ services/wallets/

WORKDIR /app/services/wallets

RUN bunx prisma generate

EXPOSE 4002

CMD ["sh", "-c", "bunx prisma migrate deploy && bun prisma/seed.ts && bun run src/main.ts"]
