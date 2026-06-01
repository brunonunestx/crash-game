import { repositories } from '#/data/repositories'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const walletQueryKey = ['wallet', 'balance']

export function useWallet() {
  const queryClient = useQueryClient()

  const useBalance = useQuery({
    queryKey: walletQueryKey,
    queryFn: () => repositories.wallets.wallet.getWalletBalance(),
    retry: (failureCount, error: unknown) => {
      if (isAxiosNotFound(error)) return false
      return failureCount < 3
    },
  })

  const useCreateWallet = useMutation({
    mutationFn: () => repositories.wallets.wallet.createWallet(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: walletQueryKey })
    },
  })

  const useDeposit = useMutation({
    mutationFn: (amount: number) => repositories.wallets.wallet.deposit(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: walletQueryKey })
    },
  })

  const useWithdraw = useMutation({
    mutationFn: (amount: number) => repositories.wallets.wallet.withdraw(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: walletQueryKey })
    },
  })

  return {
    useBalance,
    useCreateWallet,
    useDeposit,
    useWithdraw,
  }
}

export function isAxiosNotFound(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    (error as { response: { status: number } }).response?.status === 404
  )
}
