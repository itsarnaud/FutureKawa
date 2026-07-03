FROM node:lts-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npx nx build gateway --node-env=production

FROM node:lts-alpine AS runtime
WORKDIR /app

ENV GATEWAY_PORT=3010
EXPOSE 3010

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist/apps/gateway ./dist/apps/gateway

CMD ["node", "dist/apps/gateway/main.js"]
