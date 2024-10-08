#!/bin/sh

# Compile o projeto, incluindo o arquivo drizzle.config.ts
npm run build

# Rodar as migrações após a compilação
npx drizzle-kit migrate --config ./dist/drizzle.config.js

# Iniciar a aplicação
npm run start
