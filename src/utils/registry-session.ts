import { type SignOptions, sign as jwtSign } from 'jsonwebtoken'

import { env } from '~/env'

export function createJsonWebToken(payload: Record<string, unknown>) {
  const optionsSign: SignOptions = {}
  if (env.JWT_EXPIRATION) {
    optionsSign.expiresIn = env.JWT_EXPIRATION
  }

  const session = jwtSign(payload, env.JWT_SECRET, optionsSign)
  return session
}
