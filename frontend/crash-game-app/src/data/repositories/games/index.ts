import { SocketRepository } from './socket/repository'

export const gamesRepository = {
  socket: new SocketRepository(),
}
