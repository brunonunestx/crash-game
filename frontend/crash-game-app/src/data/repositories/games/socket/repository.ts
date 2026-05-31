import { io, Socket } from 'socket.io-client'
import { messages } from '@crash-game/constants'

export class SocketRepository {
  private socket: Socket | null = null

  constructor() {
    this.connect()
  }

  onSyncRound(callback: () => void) {
    if (!this.socket) return
    this.socket.on(messages.syncRound, callback)
  }

  onRoundUpdate(callback: (data: any) => void) {
    if (!this.socket) return
    this.socket.on(messages.roundUpdate, callback)
  }

  private connect() {
    if (!this.socket) {
      this.socket = io(import.meta.env.VITE_SOCKET_URL as string, {
        transports: ['websocket'],
        autoConnect: true,
      })
    }
  }
}
