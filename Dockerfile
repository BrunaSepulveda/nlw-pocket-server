FROM node:latest AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

FROM node:alpine AS slim

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules

COPY . .

RUN npm run drizzle:m && npm run seed && npm run build

EXPOSE 3333

CMD ["node", "dist/src/http/server.js"]