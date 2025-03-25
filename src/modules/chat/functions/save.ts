import { db, tables } from '@@/src/db'
import z from 'zod'

export const sendSchema = z.object({
  roomId: z.string(),
  message: z.string(),
  ownerId: z.string(),
  createdAt: z.coerce.date().optional(),
})

export type SaveRequestBody = z.infer<typeof sendSchema>

export const responseSaveSchema = z.object({
  id: z.string(),
  message: z.string(),
  ownerId: z.string(),
  roomId: z.string(),
  createdAt: z.date(),
})

export type SaveResponse = z.infer<typeof responseSaveSchema>

export async function save(body: SaveRequestBody) {
  const [message] = await db
    .insert(tables.messages)
    .values({
      roomId: body.roomId,
      ownerId: body.ownerId,
      message: body.message,
      createdAt: body.createdAt,
    })
    .returning({
      id: tables.messages.id,
      message: tables.messages.message,
      roomId: tables.messages.roomId,
      ownerId: tables.messages.ownerId,
      createdAt: tables.messages.createdAt,
    })
    .execute()

  return responseSaveSchema.parse(message)
}
