import { db, tables } from '@@/src/db'
import { asc, eq } from 'drizzle-orm'
import z from 'zod'

export const historyParamsSchema = z.object({
  roomId: z.string(),
})

export type HistoryRequestParams = z.infer<typeof historyParamsSchema>

export const responseHistorySchema = z.object({
  id: z.string(),
  message: z.string(),
  ownerId: z.string(),
  createdAt: z.coerce.date(),
})

export type HistoryResponse = z.infer<typeof responseHistorySchema>

export async function history(params: HistoryRequestParams) {
  const messages = await db
    .select({
      id: tables.messages.id,
      message: tables.messages.message,
      ownerId: tables.messages.ownerId,
      createdAt: tables.messages.createdAt,
    })
    .from(tables.messages)
    .where(eq(tables.messages.roomId, params.roomId))
    .orderBy(asc(tables.messages.createdAt))
    .execute()

  return responseHistorySchema.array().parse(messages)
}
