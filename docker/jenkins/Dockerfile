# Local Jenkins controller for exercising the repo's Jenkinsfile end-to-end.
#
# Build/run via `./scripts/start-jenkins.sh` (or
# `docker compose -f docker-compose.jenkins.yml --env-file .env.jenkins up -d --build`).
#
# `agent any` in the Jenkinsfile means every stage runs directly in this
# container, so it needs Node, npm, and the Docker CLI itself — there is no
# per-stage build agent image involved.
FROM jenkins/jenkins:lts-jdk17
USER root

# Node 20 + npm pinned to 11.9.0 — same fix as NPM_VERSION in
# .github/workflows/ci.yml: package-lock.json was generated with npm 11, and
# npm 10 (what most Node 20 installs bundle) rejects it as out of date.
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
 && apt-get install -y --no-install-recommends nodejs \
 && rm -rf /var/lib/apt/lists/* \
 && npm install -g npm@11.9.0

# Recent Node 20.x patch releases default "detect ESM syntax in ambiguous
# files" (--experimental-detect-module) to on. That heuristic intercepts
# require() of unrecognized extensions (like .ts) via Node's own ESM loader
# before ts-node's classic require.extensions hook ever runs, so `prisma db
# seed` (which shells out to `ts-node prisma/seed.ts`) fails with
# "Unknown file extension '.ts'" — even though the exact same command works
# on the Node 20 patch used elsewhere (GitHub Actions, local dev). ts-node
# 10.9.2 (pinned in package.json) predates this Node feature. Disable it and
# force CommonJS output so ts-node's classic hook behaves as it does there.
ENV NODE_OPTIONS="--no-experimental-detect-module"
ENV TS_NODE_COMPILER_OPTIONS='{"module":"CommonJS"}'

# Docker CLI + compose plugin only — no daemon in this image. DOCKER_HOST
# (set in docker-compose.jenkins.yml) points at the scoped docker-socket-proxy
# service instead of a bind-mounted host socket.
COPY --from=docker:26-cli /usr/local/bin/docker /usr/local/bin/docker
COPY --from=docker:26-cli /usr/local/libexec/docker/cli-plugins /usr/local/libexec/docker/cli-plugins

COPY docker/jenkins/plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN jenkins-plugin-cli --plugin-file /usr/share/jenkins/ref/plugins.txt

USER jenkins
