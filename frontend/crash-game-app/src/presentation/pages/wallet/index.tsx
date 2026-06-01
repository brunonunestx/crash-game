import { isAxiosNotFound } from '#/data/queries/wallets/use-wallet'
import { useWallet } from '#/data/queries/wallets/use-wallet'
import { Box } from '#/presentation/components/box'
import { Button } from '#/presentation/components/button'
import { Wallet } from 'lucide-react'

export function WalletPage() {
  const { useBalance, useCreateWallet } = useWallet()

  if (useBalance.isLoading) {
    return (
      <div className="p-8 flex items-center justify-center h-[60dvh]">
        <p className="text-foreground animate-pulse">Carregando carteira...</p>
      </div>
    )
  }

  if (isAxiosNotFound(useBalance.error)) {
    return (
      <div className="p-8 flex items-center justify-center h-[60dvh]">
        <Box className="w-96 gap-6 py-10 px-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <Wallet className="text-primary w-12 h-12" />
            <h2 className="text-xl font-bold text-primary">
              Você ainda não tem uma carteira
            </h2>
            <p className="text-foreground text-sm">
              Crie sua carteira agora para começar a apostar e retirar seus
              ganhos.
            </p>
          </div>
          <Button
            variant="gradient"
            label="Criar carteira"
            onClick={() => useCreateWallet.mutate()}
            isLoading={useCreateWallet.isPending}
            className="w-full"
            height="40px"
          />
        </Box>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-primary mb-6">Minha Carteira</h2>
      <Box className="w-fit min-w-72 items-start gap-1 py-6 px-8">
        <p className="text-foreground-variant text-sm">Saldo disponível</p>
        <p className="text-4xl font-bold text-primary">
          R$ {useBalance.data?.toFixed(2) ?? '0,00'}
        </p>
      </Box>
    </div>
  )
}
