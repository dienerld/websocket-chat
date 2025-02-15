import z from 'zod'
import { db, eq, tables } from '~/db'
import { HashEncrypt } from '~/utils/encrypt'

export const signupSchema = z.object({
  name: z.string(),
  username: z.string(),
  password: z.string(),
})

export type SignupRequestBody = z.infer<typeof signupSchema>

export async function signup(body: SignupRequestBody) {
  const [hasUser] = await db
    .select({
      id: tables.user.id,
    })
    .from(tables.user)
    .where(eq(tables.user.username, body.username))
    .execute()

  if (hasUser) {
    throw new Error('Username already exists')
  }
  const hashedPassword = HashEncrypt.encrypt(body.password)

  const [userCreated] = await db
    .insert(tables.user)
    .values({
      name: body.name,
      username: body.username,
      password: hashedPassword,
    })
    .returning({
      id: tables.user.id,
    })
    .execute()

  return {
    id: userCreated.id,
  }
}
