import z from 'zod'

function resolveEnvVars(config: NodeJS.ProcessEnv) {
  const resolvedConfig = {} as NodeJS.ProcessEnv

  for (const key in config) {
    if (!config[key]) continue
    resolvedConfig[key] = config[key].replace(
      /\${(\w+)}/g,
      (_, v) => config[v] || process.env[v] || ''
    )
  }

  return resolvedConfig
}

const envSchema = z
  .object({
    HOST: z.string().default('0.0.0.0'),
    PORT: z.coerce.number().int().min(0).max(65535).default(8080),
    DATABASE_URL: z.string().url(),
    CORS: z
      .string()
      .transform(cors => cors.split(',').map(cors => cors.trim())),
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    JWT_SECRET: z.string(),
    JWT_EXPIRATION: z.coerce
      .number()
      .int()
      .min(0)
      .max(86400)
      .default(60 * 60 * 24),
    SESSION_SECRET: z.string().default('secret-with-at-least-32-characters'),
    TURSO_AUTH_TOKEN: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.NODE_ENV === 'production' && !data.TURSO_AUTH_TOKEN) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'TURSO_AUTH_TOKEN is required in production',
      })
    }
  })

export const env = envSchema.parse(resolveEnvVars(process.env))
