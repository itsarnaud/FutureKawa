# Build the docker image with `npx nx docker:build country-api`
# (or `docker build -f apps/country-api/Dockerfile .` from the repo root).

FROM node:lts-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx prisma generate --schema=prisma/schema.prisma
RUN npx nx run country-api:build --node-env=production

# `generatePackageJson` on the webpack build produces a minimal package.json
# in dist/apps/country-api listing only the packages actually required by the
# bundle (no frontend deps, no dev tooling) — installing straight from it
# keeps the runtime image small without hand-maintaining a dependency list.
FROM node:lts-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

COPY --from=build /app/dist/apps/country-api ./
RUN npm install --omit=dev
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

CMD ["node", "main.js"]
