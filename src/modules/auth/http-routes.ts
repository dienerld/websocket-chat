import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { generateResponseSchemaHandler } from '~/utils/generate-schema-handler'
import { responseSigninSchema, signin, signinSchema } from './functions/signin'
import { signup, signupSchema } from './functions/signup'

export const routes: FastifyPluginAsyncZod = async app => {
  app.post(
    '/signup',
    {
      schema: {
        body: signupSchema,
        ...generateResponseSchemaHandler({
          tags: ['Auth'],
          operationId: 'Signup',
          summary: 'Signup',
          description: 'Signup a user',
          isPublic: true,
          codeResponseSuccess: 201,
          schemaResponseSuccess: z.object({
            id: z.string(),
          }),
        }),
      },
    },
    async (request, reply) => {
      const response = await signup(request.body)

      return reply.status(200).send(response)
    }
  )

  app.post(
    '/signin',
    {
      schema: {
        body: signinSchema,
        ...generateResponseSchemaHandler({
          tags: ['Auth'],
          operationId: 'Login',
          summary: 'Login',
          description: 'Login a user',
          isPublic: true,
          codeResponseSuccess: 200,
          schemaResponseSuccess: responseSigninSchema,
        }),
      },
    },
    async (request, reply) => {
      const response = await signin(request.body)

      return reply.status(200).send(response)
    }
  )
}
