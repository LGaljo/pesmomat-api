# Base image
FROM node:18-alpine as builder

WORKDIR /app

COPY --chown=node:node . .

RUN apk update && apk add build-base gcc wget git
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
# RUN python3 -m ensurepip
# RUN pip3 install --no-cache --upgrade pip setuptools

RUN npm ci --legacy-peer-deps

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder --chown=node:node /app  .

USER node

ARG NODE_ENV=production
ARG HOST=0.0.0.0
#ARG PORT=3100
#ARG API_URL=http://localhost:4500

EXPOSE 4500

CMD ["npm", "run", "start:prod"]
