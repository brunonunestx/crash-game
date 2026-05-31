import { BetRepository } from './bet/repository'
import { SocketRepository } from './socket/repository'

export const gamesRepository = {
  socket: new SocketRepository(),
  bet: new BetRepository(),
}
