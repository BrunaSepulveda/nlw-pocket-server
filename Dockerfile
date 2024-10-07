FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run drizzle:m && npm run seed && npm run build

EXPOSE 3333

CMD ["node", "dist/src/http/server.js"]
