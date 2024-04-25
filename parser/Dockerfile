FROM node:18 as base

WORKDIR /app

COPY package.json package-lock.json ./

COPY . .

WORKDIR /app/parser

RUN npm ci

RUN npm run build

CMD [ "npm", "start" ]