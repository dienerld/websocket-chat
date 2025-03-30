import { defineConfig } from 'drizzle-kit'

const credentials =
  process.env.NODE_ENV === 'production'
    ? {
        url: process.env.DATABASE_URL as string,
        authToken: process.env.TURSO_AUTH_TOKEN as string,
      }
    : {
        url: process.env.DATABASE_URL as string,
      }

export default defineConfig({
  schema: './src/db/schemas',
  out: './src/db/_migrations',
  dialect: 'turso',
  dbCredentials: credentials,
})
