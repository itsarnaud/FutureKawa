# Build the docker image with `npx nx docker:build fe`
# (or `docker build -f apps/fe/Dockerfile .` from the repo root).
#
# NEXT_PUBLIC_* variables are inlined into the client bundle at build time,
# so the gateway URL the browser will call must be passed as a build ARG
# (not just a runtime env var) — see NEXT_PUBLIC_API_URL in .env.exemple.

FROM node:lts-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
RUN npx nx run fe:build

# next.config.js sets `output: "standalone"`, which produces a self-contained
# server bundle with only the node_modules it actually needs — public/ and
# the static assets still need to be copied in manually (Next.js doesn't
# bundle them into the standalone output).
FROM node:lts-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

COPY --from=build /app/apps/fe/.next/standalone ./
COPY --from=build /app/apps/fe/.next/static ./apps/fe/.next/static
COPY --from=build /app/apps/fe/public ./apps/fe/public

CMD ["node", "apps/fe/server.js"]
