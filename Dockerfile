FROM node:16-alpine as base

WORKDIR /app

COPY yarn.lock package.json .npmrc /app/
RUN yarn install --frozen-lockfile --production

ENV NODE_ENV=production

FROM base as builder

RUN yarn install --frozen-lockfile --production=false

COPY . .

RUN yarn build

FROM base

ENV NODE_ENV=production

COPY --from=builder /app/dist /app/dist
COPY yarn.lock package.json /app/
COPY config /app/config

CMD yarn start:api:prod
