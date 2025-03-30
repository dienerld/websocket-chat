import { eq, not } from 'drizzle-orm'
import z from 'zod'
import { db, tables } from '~/db'

export const responseContactsSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    username: z.string(),
    roomId: z.string(),
  })
)

export type ContactsResponse = z.infer<typeof responseContactsSchema>
// export async function getContacts(userId: string): Promise<ContactsResponse> {
//   const myRooms = await db
//     .select({ roomId: tables.roomMembers.roomId })
//     .from(tables.roomMembers)
//     .where(eq(tables.roomMembers.userId, userId))

//   const membersByRoom = await db
//     .select({
//       id: tables.roomMembers.userId,
//       name: tables.user.name,
//       username: tables.user.username,
//       roomId: tables.roomMembers.roomId,
//     })
//     .from(tables.roomMembers)
//     .leftJoin(tables.user, eq(tables.roomMembers.userId, tables.user.id))
//     .where(
//       and(
//         inArray(
//           tables.roomMembers.roomId,
//           myRooms.map(room => room.roomId)
//         ),
//         not(eq(tables.roomMembers.userId, userId))
//       )
//     )

//   return responseContactsSchema.parse(membersByRoom)
// }

export async function getContacts(userId: string): Promise<ContactsResponse> {
  const cteGetRooms = db
    .$with('get_rooms')
    .as(
      db
        .select({ roomId: tables.roomMembers.roomId })
        .from(tables.roomMembers)
        .where(eq(tables.roomMembers.userId, userId))
    )

  const contactsWithRoom = await db
    .with(cteGetRooms)
    .select({
      id: tables.roomMembers.userId,
      name: tables.user.name,
      username: tables.user.username,
      roomId: tables.roomMembers.roomId,
    })
    .from(tables.roomMembers)
    .leftJoin(tables.user, eq(tables.roomMembers.userId, tables.user.id))
    .innerJoin(cteGetRooms, eq(tables.roomMembers.roomId, cteGetRooms.roomId))
    .where(not(eq(tables.roomMembers.userId, userId)))

  return responseContactsSchema.parse(contactsWithRoom)
}
