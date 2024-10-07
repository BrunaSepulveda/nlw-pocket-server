FROM node:latest AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install && npm run drizzle migrate

COPY . .

RUN npm run seed && npm run build

EXPOSE 3333

CMD ["node", "dist/src/http/server.js"]