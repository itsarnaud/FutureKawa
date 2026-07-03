# Build the docker image with `npx nx docker:build alerting-service`
# (or `docker build -f apps/alerting-service/Dockerfile .` from the repo root).

FROM node:lts-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npx nx build alerting-service --node-env=production

FROM node:lts-alpine AS runtime
WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist/apps/alerting-service ./dist/apps/alerting-service

CMD ["node", "dist/apps/alerting-service/main.js"]
