import { db, tables } from '@@/src/db'
import { eq } from 'drizzle-orm'
import z from 'zod'

export const responseContactsSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    username: z.string(),
    roomId: z.string(),
  })
)

export type ContactsResponse = z.infer<typeof responseContactsSchema>
export async function getContacts(id: string): Promise<ContactsResponse> {
  const contacts = await db
    .selectDistinctOn([tables.user.id], {
      id: tables.user.id,
      name: tables.user.name,
      username: tables.user.username,
      roomId: tables.roomMembers.roomId,
    })
    .from(tables.friend)
    .where(eq(tables.friend.userId, id))
    .innerJoin(tables.user, eq(tables.friend.friendId, tables.user.id))
    .innerJoin(
      tables.roomMembers,
      eq(tables.friend.friendId, tables.roomMembers.userId)
    )
    .execute()

  return responseContactsSchema.parse(contacts)
}
