#!/usr/bin/env bash

set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -f .env.jenkins ]; then
  echo "No .env.jenkins found, creating one from .env.jenkins.example..."
  cp .env.jenkins.example .env.jenkins
fi

echo "==> Starting local Jenkins stack..."
docker compose -f docker-compose.jenkins.yml --env-file .env.jenkins up -d --build

set -o allexport
# shellcheck disable=SC1091
source .env.jenkins
set +o allexport

cat <<EOF

==> Jenkins is up.

  URL              http://localhost:8080
  User             ${JENKINS_ADMIN_USER}
  Password         see .env.jenkins (JENKINS_ADMIN_PASSWORD)

  Seeded jobs:
  - futurekawa-pipeline  builds file:///repo-checkout-source (whatever is
                         currently checked out locally) — no push needed,
                         a local commit is enough.
  - futurekawa-github    multibranch job, auto-discovers branches and pull
                         requests on https://github.com/itsarnaud/FutureKawa
                         (polls every 5 min, no webhook required). Set
                         GITHUB_USER/GITHUB_TOKEN in .env.jenkins to use an
                         authenticated GitHub API rate limit instead of
                         anonymous polling.

  Stop with: docker compose -f docker-compose.jenkins.yml --env-file .env.jenkins down

EOF
