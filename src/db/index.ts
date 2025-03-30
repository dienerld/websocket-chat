import { type Config, createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { env } from '../env'

export {
  eq,
  and,
  or,
  not,
  asc,
  desc,
  between,
  sql,
  type SQL,
} from 'drizzle-orm'
import * as tables from './schemas'

export { tables }

const cfg: Config = {
  url: env.DATABASE_URL,
}

if (env.NODE_ENV === 'production') {
  cfg.authToken = env.TURSO_AUTH_TOKEN
}

const client = createClient(cfg)

export const db = drizzle(client, { schema: tables, logger: false })
