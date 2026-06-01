import { useQuery } from '@tanstack/react-query'
import { repositories } from '#/data/repositories'

export const roundBetsQueryKey = (roundId: string) =>
  ['bets', 'round', roundId] as const

export function useRoundBets(roundId: string | undefined) {
  return useQuery({
    queryKey: roundBetsQueryKey(roundId ?? ''),
    queryFn: () => repositories.games.bet.getRoundBets(roundId!),
    enabled: !!roundId,
    refetchInterval: 1000,
  })
}
