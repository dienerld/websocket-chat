import z from 'zod'
import { db, eq, tables } from '~/db'
import { AppError } from '~/utils/app.error'
import { HashEncrypt } from '~/utils/encrypt'
import { createJsonWebToken } from '~/utils/registry-session'

export const signinSchema = z.object({
  username: z.string(),
  password: z.string(),
})

export type SigninRequestBody = z.infer<typeof signinSchema>

export const responseSigninSchema = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string(),
  session: z.string(),
})

export type SigninResponse = z.infer<typeof responseSigninSchema>

export async function signin(body: SigninRequestBody): Promise<SigninResponse> {
  const [user] = await db
    .select({
      id: tables.user.id,
      name: tables.user.name,
      username: tables.user.username,
      password: tables.user.password,
    })
    .from(tables.user)
    .where(eq(tables.user.username, body.username))
    .limit(1)
    .execute()

  if (!user) {
    throw new AppError('User not found', 404)
  }

  if (!HashEncrypt.compare(body.password, user.password)) {
    throw new AppError('Username or password is incorrect', 401)
  }

  const session = createJsonWebToken({ userId: user.id })
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    session,
  }
}
