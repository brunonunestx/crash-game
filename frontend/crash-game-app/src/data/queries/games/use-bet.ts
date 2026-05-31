import { repositories } from '#/data/repositories'
import type { ICreateBetInput } from '@crash-game/types'
import { useMutation } from '@tanstack/react-query'

export function useBet() {
  const useCreateBet = useMutation({
    mutationFn: (payload: ICreateBetInput) =>
      repositories.games.bet.createBet(payload),
  })

  const useCashOut = useMutation({
    mutationFn: () => repositories.games.bet.cashOut(),
  })

  const useCancelBet = useMutation({
    mutationFn: () => repositories.games.bet.cancelBet(),
  })

  return {
    useCreateBet,
    useCashOut,
    useCancelBet,
  }
}
