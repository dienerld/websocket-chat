import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { verifyAuth } from '~/http/middleware/verify-auth'
import { generateResponseSchemaHandler } from '~/utils/generate-schema-handler'
import {
  addContact,
  addContactSchema,
  responseAddContactSchema,
} from './functions/add-contact'
import {
  checkIfUserExists,
  responseUserExistsSchema,
} from './functions/check-if-exists'
import { getContacts, responseContactsSchema } from './functions/get-contacts'
import { getUserById, userResponseSchema } from './functions/get-user'

export const routes: FastifyPluginAsyncZod = async app => {
  app.get(
    '/me',
    {
      onRequest: [verifyAuth],
      schema: {
        ...generateResponseSchemaHandler({
          tags: ['User'],
          operationId: 'getUser',
          summary: 'Get By Access Token',
          description: 'Get a user',
          codeResponseSuccess: 200,
          schemaResponseSuccess: userResponseSchema,
        }),
      },
    },
    async (request, reply) => {
      const response = await getUserById(request.session.user_id)

      return reply.status(200).send(response)
    }
  )

  app.get(
    '/contacts',
    {
      onRequest: [verifyAuth],
      schema: {
        ...generateResponseSchemaHandler({
          tags: ['User'],
          operationId: 'getContacts',
          summary: 'Get Contacts',
          description: 'Get contacts',
          codeResponseSuccess: 200,
          schemaResponseSuccess: responseContactsSchema,
        }),
      },
    },
    async (request, reply) => {
      const response = await getContacts(request.session.user_id)

      return reply.status(200).send(response)
    }
  )

  app.get(
    '/:username/exists',
    {
      onRequest: [verifyAuth],
      schema: {
        params: z.object({ username: z.string() }),
        ...generateResponseSchemaHandler({
          tags: ['User'],
          operationId: 'userExists',
          summary: 'Verify if user exists',
          description: 'Verify if user exists',
          codeResponseSuccess: 200,
          schemaResponseSuccess: responseUserExistsSchema,
        }),
      },
    },
    async (request, reply) => {
      const response = await checkIfUserExists(request.params.username)

      return reply.status(200).send(response)
    }
  )

  app.get(
    '/:id',
    {
      onRequest: [verifyAuth],
      schema: {
        params: z.object({ id: z.string() }),
        ...generateResponseSchemaHandler({
          tags: ['User'],
          operationId: 'getUserById',
          summary: 'Get User By Id',
          description: 'Get user by id',
          codeResponseSuccess: 200,
          schemaResponseSuccess: userResponseSchema,
        }),
      },
    },
    async (request, reply) => {
      const response = await getUserById(request.params.id)

      return reply.status(200).send(response)
    }
  )

  app.post(
    '/add-contact',
    {
      onRequest: [verifyAuth],
      schema: {
        body: addContactSchema,
        ...generateResponseSchemaHandler({
          tags: ['User'],
          operationId: 'addContact',
          summary: 'Adicionar Contato',
          description: 'Adiciona um novo contato à lista de amigos do usuário',
          codeResponseSuccess: 201,
          schemaResponseSuccess: responseAddContactSchema,
        }),
      },
    },
    async (request, reply) => {
      const response = await addContact(request.session.user_id, request.body)

      return reply.status(201).send(response)
    }
  )
}
