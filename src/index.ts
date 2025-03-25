import { env } from '@env'
import { fastifyInstance } from './app'
import { socketEventsChat } from './modules/chat'
import { createSocket } from './socket'

async function bootstrap() {
  createSocket(fastifyInstance, socketEventsChat)
  await fastifyInstance.listen({ host: env.HOST, port: env.PORT })
  console.log(fastifyInstance.printRoutes())
  console.log(`HTTP server running on http://${env.HOST}:${env.PORT}`)
}

bootstrap()
