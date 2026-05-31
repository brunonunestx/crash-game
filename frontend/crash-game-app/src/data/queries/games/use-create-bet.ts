import { repositories } from '#/data/repositories'
import type { ICreateBetInput } from '@crash-game/types'
import { useMutation } from '@tanstack/react-query'

export function useCreateBet() {
  return useMutation({
    mutationFn: (payload: ICreateBetInput) =>
      repositories.games.bet.createBet(payload),
  })
}
