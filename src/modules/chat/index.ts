import fp from 'fastify-plugin'

import { type SocketJoinEvent, onJoin } from './events'
import { getRooms } from './functions/getRooms'
import { routes } from './http-routes'

export default fp(async (fastify, options) => {
  fastify.register(routes, { prefix: '/chat' })
})

export const socketEventsChat: SocketJoinEvent[] = [onJoin(getRooms)]
