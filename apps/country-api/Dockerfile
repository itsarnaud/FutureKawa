FROM node:lts-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npx nx build country-api --node-env=production

FROM node:lts-alpine AS runtime
WORKDIR /app

ENV PORT=3000
EXPOSE 3000

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist/apps/country-api ./dist/apps/country-api

CMD ["node", "dist/apps/country-api/main.js"]
