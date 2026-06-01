import { useQuery } from '@tanstack/react-query'
import { repositories } from '#/data/repositories'

export const roundHistoryQueryKey = ['rounds', 'history'] as const

export function useRoundHistory() {
  return useQuery({
    queryKey: roundHistoryQueryKey,
    queryFn: () => repositories.games.round.getHistory(1, 30),
  })
}
