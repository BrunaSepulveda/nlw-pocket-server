#!/bin/sh

# Rodar as migrações antes de iniciar o servidor
npx drizzle-kit migrate

# Iniciar a aplicação
npm run start
