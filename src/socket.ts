import type { FastifyInstance } from 'fastify'
import { verify } from 'jsonwebtoken'
import { Server } from 'socket.io'
import { env } from './env'
import type { SocketJoinEvent } from './modules/chat/events'
import { save } from './modules/chat/functions/save'

type Message = {
  roomId: string
  message: string
  ownerId: string
  createdAt: string | Date
}

export function createSocket(
  app: FastifyInstance,
  listeners: SocketJoinEvent[]
) {
  const io = new Server(app.server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  })

  io.use((socket, next) => {
    try {
      if (socket.handshake.auth.token) {
        const session = verify(
          socket.handshake.auth.token.replace('Bearer ', ''),
          env.JWT_SECRET
        ) as {
          id: string
        }
        if (session) {
          socket.userId = session.id
        }
        next()
      } else {
        next(new Error('Authentication error'))
      }
    } catch (error) {
      next(new Error('Authentication error'))
    }
  })

  io.on('connection', async socket => {
    for (const listener of listeners) {
      listener.func(socket)
    }

    socket.on('message', async (message: Message) => {
      const response = await save({
        roomId: message.roomId,
        message: message.message,
        ownerId: socket.userId,
        createdAt: message.createdAt ? new Date(message.createdAt) : new Date(),
      })
      io.to(message.roomId).emit('message', response)
    })
  })

  return io
}
