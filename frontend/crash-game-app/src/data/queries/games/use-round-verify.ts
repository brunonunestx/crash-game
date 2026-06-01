import { useQuery } from '@tanstack/react-query'
import { repositories } from '#/data/repositories'

export function useRoundVerify(roundId: string | null) {
  return useQuery({
    queryKey: ['rounds', 'verify', roundId],
    queryFn: () => repositories.games.round.getVerifyData(roundId!),
    enabled: !!roundId,
  })
}
