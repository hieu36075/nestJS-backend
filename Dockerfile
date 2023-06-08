FROM node:18 AS dependencies

WORKDIR /usr/src/app
COPY package.json .
COPY package-lock.json .
RUN npm install   

FROM node:18 as build
WORKDIR /usr/src/app
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY prisma ./prisma/

COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18 AS deploy
RUN apt update && apt install libssl-dev dumb-init -y --no-install-recommends
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/.env .env
COPY --chown=node:node --from=build /usr/src/app/package.json .
COPY --chown=node:node --from=build /usr/src/app/package-lock.json .
RUN npm install --omit=dev
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma
COPY --chown=node:node --from=build /usr/src/app/node_modules/.prisma/client  ./node_modules/.prisma/client

ENV NODE_ENV production
EXPOSE 3500
CMD ["dumb-init", "node", "dist/src/main"]