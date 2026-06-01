FROM oven/bun:1-alpine

WORKDIR /app

# Monorepo root workspace
COPY package.json bun.lock ./
COPY packages/ packages/

# Service manifest first (layer cache)
COPY services/games/package.json services/games/package.json

RUN bun install --frozen-lockfile

# Service source
COPY services/games/ services/games/

WORKDIR /app/services/games

RUN bunx prisma generate

EXPOSE 4001

CMD ["sh", "-c", "bunx prisma migrate deploy && bun run src/main.ts"]
