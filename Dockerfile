FROM node:latest AS builder

WORKDIR /app

ARG DB_USER
ARG DB_PASSWORD
ARG DB_NAME
ARG DB_TYPE
ARG DB_HOST
ARG DB_PORT

ENV DATABASE_URL="${DB_TYPE}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

COPY package*.json ./
COPY drizzle.config.ts ./

RUN npm install

COPY . .

# Copia o script de espera pelo PostgreSQL
COPY wait-for-postgres.sh ./
RUN chmod +x wait-for-postgres.sh

RUN npm run build

EXPOSE 3333

# Espera o PostgreSQL ficar disponível antes de rodar as migrações e iniciar o servidor
CMD ["./wait-for-postgres.sh", "npx drizzle-kit migrate && npm run seed && node dist/src/http/server.js"]
