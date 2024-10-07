FROM node:latest AS builder

WORKDIR /app

COPY package*.json ./
COPY drizzle.config.json ./

RUN npm install

COPY . .

RUN npm run drizzle:m && npm run seed && npm run build

EXPOSE 3333

CMD ["node", "dist/src/http/server.js"]