import z from 'zod'
import { db, eq, tables } from '~/db'

export const userResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string(),
})

export type UserResponse = z.infer<typeof userResponseSchema>

export async function getMe(id: string): Promise<UserResponse> {
  const [userDb] = await db
    .select({
      id: tables.user.id,
      name: tables.user.name,
      username: tables.user.username,
    })
    .from(tables.user)
    .where(eq(tables.user.id, id))
    .execute()

  return userResponseSchema.parse(userDb)
}
