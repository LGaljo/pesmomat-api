# Base image
FROM node:18 as builder

WORKDIR /app

COPY --chown=node:node . .

RUN apt update && apt install build-essential python3 libcups2-dev -y

RUN npm install printer --target_arch=x64 --target_platform=linux

RUN npm ci

RUN npm run build

FROM node:18-slim

WORKDIR /app

RUN apt update && apt install libcups2 -y

COPY --from=builder --chown=node:node /app  .
COPY --from=builder --chown=node:node /app/node_modules ./node_modules

USER node

ARG NODE_ENV=production
ARG HOST=0.0.0.0

EXPOSE 4400

CMD ["npm", "run", "start:prod"]
