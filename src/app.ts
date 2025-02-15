import { join } from 'node:path'
import { version } from '@@/package.json'
import fastifyAutoload, { type AutoloadPluginOptions } from '@fastify/autoload'
import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastify, { type FastifyServerOptions } from 'fastify'
import {
  type ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

import { env } from '@env'
import { parseZodError } from '~/utils/parse-zod-error'

import { rootRouter } from './http/routes/root'

export interface AppOptions
  extends FastifyServerOptions,
    Partial<AutoloadPluginOptions> {}
// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {}

export const fastifyInstance = fastify()
  .setValidatorCompiler(validatorCompiler)
  .setSerializerCompiler(serializerCompiler)
  .withTypeProvider<ZodTypeProvider>()
  .register(fastifyCors, { origin: env.CORS })
  .register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Chat API',
        description: 'Simple fastify chat API for study websocket',
        version,
      },
      servers: [],
      tags: [
        { name: 'Root', description: 'Operations about root' },
        { name: 'Auth', description: 'Operations about auth' },
        { name: 'User', description: 'Operations about users' },
      ],
    },
    transform: jsonSchemaTransform,
  })
  .register(require('@scalar/fastify-api-reference'), {
    routePrefix: '/docs',
  })
  .setErrorHandler(parseZodError)

fastifyInstance.register(rootRouter, { prefix: '/' })

void fastifyInstance.register(fastifyAutoload, {
  dir: join(__dirname, 'modules'),
  maxDepth: 1,
})
