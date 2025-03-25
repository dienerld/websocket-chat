import { db, eq, tables } from '@@/src/db'
import z from 'zod'

export const responseUserExistsSchema = z.object({
  exists: z.boolean(),
})

export type UserExistResponse = z.infer<typeof responseUserExistsSchema>

export async function checkIfUserExists(
  username: string
): Promise<UserExistResponse> {
  const [userExist] = await db
    .select({
      id: tables.user.id,
    })
    .from(tables.user)
    .where(eq(tables.user.username, username))
    .limit(1)

  console.log(userExist)

  return responseUserExistsSchema.parse({ exists: !!userExist })
}
