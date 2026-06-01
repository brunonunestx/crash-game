import { repositories } from '#/data/repositories'
import { walletQueryKey } from '#/data/queries/wallets/use-wallet'
import { Toast } from '#/presentation/components/toast'
import type { ICashoutResponse, ICreateBetInput } from '@crash-game/types'
import { centsToDouble } from '@crash-game/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createElement } from 'react'
import { toast } from 'sonner'

export function useBet() {
  const queryClient = useQueryClient()

  const useCreateBet = useMutation({
    mutationFn: (payload: ICreateBetInput) =>
      repositories.games.bet.createBet(payload),
  })

  const useCashOut = useMutation({
    mutationFn: () => repositories.games.bet.cashOut(),
    onSuccess: (data: ICashoutResponse) => {
      queryClient.invalidateQueries({ queryKey: walletQueryKey })
      const amount = centsToDouble(data.cashoutAmount).toFixed(2)
      const multiplier = centsToDouble(data.multiplier).toFixed(2)
      toast.custom(() =>
        createElement(Toast, {
          message: `Você ganhou R$ ${amount} a ${multiplier}x!`,
          type: 'success',
        }),
      )
    },
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
