import type { Socket } from 'socket.io'

export interface SocketJoinEvent {
  func: (socket: Socket) => void | Promise<void>
}

export function onJoin(
  promise: (userId: string) => Promise<string[]>
): SocketJoinEvent {
  return {
    func: async socket => {
      const rooms = await promise(socket.userId)
      for (const room of rooms) {
        socket.join(room)
      }
    },
  }
}
