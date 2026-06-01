#!/usr/bin/env bash
set -e

COMPOSE_FILE="docker-compose.test.yml"

export DATABASE_URL="postgresql://admin:admin@localhost:5433/games_test"
export RABBITMQ_URL="amqp://admin:admin@localhost:5673"
export PORT="4011"

cleanup() {
  echo "→ Derrubando containers de teste..."
  docker compose -f "$COMPOSE_FILE" down --volumes --remove-orphans
}
trap cleanup EXIT

echo "→ Subindo postgres-test e rabbitmq-test..."
docker compose -f "$COMPOSE_FILE" up -d --wait

echo "→ Rodando migrations..."
bunx prisma migrate deploy --config prisma.config.ts

echo "→ Rodando testes e2e..."
bun test tests/e2e --timeout 90000

echo "✓ Testes concluídos."
