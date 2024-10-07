FROM node:latest AS builder

WORKDIR /app

# Declare as variáveis como argumentos de build
ARG DB_USER
ARG DB_PASSWORD
ARG DB_NAME
ARG DB_TYPE
ARG DB_HOST
ARG DB_PORT

# Passa os argumentos como variáveis de ambiente no contêiner
ENV DATABASE_URL="${DB_TYPE}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

COPY package*.json ./
COPY drizzle.config.ts ./

RUN npm install

COPY . .

# Usa a variável de ambiente no comando de build
RUN npm run drizzle:m && npm run seed && npm run build

EXPOSE 3333

CMD ["node", "dist/src/http/server.js"]
