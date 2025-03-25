import { db, eq, tables } from '~/db'

export async function getRooms(userId: string): Promise<string[]> {
  const rooms = await db
    .select({
      id: tables.rooms.id,
      name: tables.user.name,
    })
    .from(tables.rooms)
    .innerJoin(
      tables.roomMembers,
      eq(tables.rooms.id, tables.roomMembers.roomId)
    )
    .innerJoin(tables.user, eq(tables.roomMembers.userId, tables.user.id))
    .where(eq(tables.roomMembers.userId, userId))
    .execute()

  return rooms.map(room => room.id)
}
