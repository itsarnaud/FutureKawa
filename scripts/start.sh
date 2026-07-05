#!/usr/bin/env bash

set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  echo "No .env found, creating one from .env.exemple..."
  cp .env.exemple .env
fi

set -o allexport
# shellcheck disable=SC1091
source .env
set +o allexport

echo "==> Starting docker compose stack..."
docker compose up -d --build

wait_for_postgres() {
  local service="$1"
  local label="$2"
  echo "==> Waiting for Postgres ($label)..."
  until docker compose exec -T "$service" pg_isready -U "$POSTGRES_USER" >/dev/null 2>&1; do
    sleep 1
  done
}

seed_country() {
  local port="$1"
  local code="$2"
  local url="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${port}/${POSTGRES_DB}?schema=public"
  echo "==> Migrating + seeding $code database..."
  DATABASE_URL="$url" npx prisma db push --accept-data-loss >/dev/null
  DATABASE_URL="$url" SEED_COUNTRY="$code" npx prisma db seed >/dev/null
}

wait_for_postgres postgres-bresil "Brésil"
wait_for_postgres postgres-equateur "Équateur"
wait_for_postgres postgres-colombie "Colombie"

seed_country "$POSTGRES_PORT_BR" BR
seed_country "$POSTGRES_PORT_EC" EC
seed_country "$POSTGRES_PORT_CO" CO

cat <<EOF

==> FutureKawa is up.

  Frontend                    http://localhost:3001
  Gateway (API centrale)      http://localhost:${GATEWAY_PORT}/api
  country-api Brésil          http://localhost:3000/api
  country-api Équateur        http://localhost:3002/api
  country-api Colombie        http://localhost:3003/api
  Mailpit (e-mails d'alerte)  http://localhost:8025

EOF
