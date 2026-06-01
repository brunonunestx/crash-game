import { BetRepository } from './bet/repository'
import { RoundRepository } from './round/repository'
import { SocketRepository } from './socket/repository'

export const gamesRepository = {
  socket: new SocketRepository(),
  bet: new BetRepository(),
  round: new RoundRepository(),
}
