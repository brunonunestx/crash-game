import { useQuery } from '@tanstack/react-query'
import { repositories } from '#/data/repositories'

export const myBetsQueryKey = (page: number, limit: number) =>
  ['bets', 'me', page, limit] as const

export function useMyBets(page = 1, limit = 20) {
  return useQuery({
    queryKey: myBetsQueryKey(page, limit),
    queryFn: () => repositories.games.bet.getMyBets(page, limit),
  })
}
