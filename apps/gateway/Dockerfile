# Build the docker image with `npx nx docker:build gateway`
# (or `docker build -f apps/gateway/Dockerfile .` from the repo root).

FROM node:lts-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx prisma generate --schema=prisma/schema.prisma
RUN npx nx run gateway:build --node-env=production

# `generatePackageJson` on the webpack build produces a minimal package.json
# in dist/apps/gateway listing only the packages actually required by the
# bundle (no frontend deps, no dev tooling) — installing straight from it
# keeps the runtime image small without hand-maintaining a dependency list.
# The gateway only touches a database for its own auth/users table (see
# apps/gateway/src/app/auth) — everything else is proxied to the country APIs.
FROM node:lts-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV GATEWAY_PORT=3010
EXPOSE 3010

COPY --from=build /app/dist/apps/gateway ./
RUN npm install --omit=dev
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

CMD ["node", "main.js"]
