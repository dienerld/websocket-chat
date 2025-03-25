import { verifyAuth } from '@@/src/http/middleware/verify-auth'
import { generateResponseSchemaHandler } from '@@/src/utils/generate-schema-handler'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import {
  history,
  historyParamsSchema,
  responseHistorySchema,
} from './functions/history'
import { responseSaveSchema, save, sendSchema } from './functions/save'

export const routes: FastifyPluginAsyncZod = async app => {
  app.post(
    '/send',
    {
      onRequest: [verifyAuth],
      schema: {
        body: sendSchema,
        ...generateResponseSchemaHandler({
          tags: ['Chat'],
          operationId: 'send',
          summary: 'Send',
          description: 'Send a message',
          codeResponseSuccess: 200,
          schemaResponseSuccess: responseSaveSchema,
        }),
      },
    },
    async (request, reply) => {
      const response = await save(request.body)

      return reply.status(200).send(response)
    }
  )

  app.get(
    '/history/:roomId',
    {
      onRequest: [verifyAuth],
      schema: {
        params: historyParamsSchema,
        ...generateResponseSchemaHandler({
          tags: ['Chat'],
          operationId: 'history',
          summary: 'History',
          description: 'Get a message history',
          codeResponseSuccess: 200,
          schemaResponseSuccess: responseHistorySchema.array(),
        }),
      },
    },
    async (request, reply) => {
      const response = await history(request.params)

      return reply.status(200).send(response)
    }
  )
}
