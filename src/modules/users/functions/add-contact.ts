import z from 'zod'
import { and, db, eq, or, tables } from '~/db'
import { AppError } from '~/utils/app.error'

export const addContactSchema = z.object({
  username: z.string(),
})

export type AddContactRequestBody = z.infer<typeof addContactSchema>

export const responseAddContactSchema = z.object({
  id: z.string(),
  friendId: z.string(),
})

export type AddContactResponse = z.infer<typeof responseAddContactSchema>

export async function addContact(
  userId: string,
  body: AddContactRequestBody
): Promise<AddContactResponse> {
  // Verifica se o usuário a ser adicionado existe
  const [friendUser] = await db
    .select({
      id: tables.user.id,
    })
    .from(tables.user)
    .where(eq(tables.user.username, body.username))
    .limit(1)
    .execute()

  if (!friendUser) {
    throw new AppError('Usuário não encontrado', 404)
  }

  // Verifica se já existe amizade em qualquer direção (user1 -> user2 ou user2 -> user1)
  const [existingFriendship] = await db
    .select({
      id: tables.friend.id,
    })
    .from(tables.friend)
    .where(
      or(
        and(
          eq(tables.friend.userId, userId),
          eq(tables.friend.friendId, friendUser.id)
        ),
        and(
          eq(tables.friend.userId, friendUser.id),
          eq(tables.friend.friendId, userId)
        )
      )
    )
    .limit(1)
    .execute()

  if (existingFriendship) {
    throw new AppError('Contato já adicionado.', 400)
  }

  // Cria uma nova sala para a conversa
  const [room] = await db
    .insert(tables.rooms)
    .values({
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning({
      id: tables.rooms.id,
    })
    .execute()

  // Adiciona os dois usuários como membros da sala
  await db
    .insert(tables.roomMembers)
    .values([
      {
        roomId: room.id,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roomId: room.id,
        userId: friendUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
    .execute()

  // Cria a amizade
  const [friendship] = await db
    .insert(tables.friend)
    .values({
      userId: userId,
      friendId: friendUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning({
      id: tables.friend.id,
      friendId: tables.friend.friendId,
    })
    .execute()

  return responseAddContactSchema.parse(friendship)
}
