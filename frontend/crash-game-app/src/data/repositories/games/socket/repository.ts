import { io, Socket } from 'socket.io-client'
import { messages } from '@crash-game/constants'
import { type IRound } from '@crash-game/types'

export class SocketRepository {
  private socket: Socket | null = null

  constructor() {
    this.buildSocket()
  }

  onSyncRound(callback: (data: IRound) => void) {
    if (!this.socket) return
    this.socket.on(messages.syncRound, callback)
  }

  onRoundUpdate(callback: (data: IRound) => void) {
    if (!this.socket) return
    this.socket.on(messages.roundUpdate, callback)
  }

  connect() {
    if (this.socket && !this.socket.connected) {
      this.socket.connect()
    }
  }

  disconnect() {
    this.socket?.disconnect()
  }

  private buildSocket() {
    if (!this.socket) {
      this.socket = io(import.meta.env.VITE_SOCKET_URL as string, {
        transports: ['websocket'],
        autoConnect: false,
      })
    }
  }
}
