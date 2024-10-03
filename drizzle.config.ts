import { defineConfig } from 'drizzle-kit'
import { env } from './src/env.ts'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: `${env.DB_TYPE}://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`,
  },
})
