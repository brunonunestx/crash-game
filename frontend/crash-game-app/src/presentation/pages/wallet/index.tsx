import { isAxiosNotFound, useWallet } from '#/data/queries/wallets/use-wallet'
import { Box } from '#/presentation/components/box'
import { Button } from '#/presentation/components/button'
import { Input } from '#/presentation/components/input'
import { ArrowDownToLine, ArrowUpFromLine, Wallet } from 'lucide-react'
import { useState } from 'react'

type Operation = 'deposit' | 'withdraw' | null

export function WalletPage() {
  const { useBalance, useCreateWallet, useDeposit, useWithdraw } = useWallet()
  const [operation, setOperation] = useState<Operation>(null)
  const [amount, setAmount] = useState('')

  const parsedAmount = parseFloat(amount)
  const isValidAmount = !isNaN(parsedAmount) && parsedAmount > 0

  function handleSelectOperation(op: Operation) {
    setOperation((prev) => (prev === op ? null : op))
    setAmount('')
  }

  function handleConfirm() {
    const onSuccess = () => {
      setOperation(null)
      setAmount('')
    }

    if (operation === 'deposit') {
      useDeposit.mutate(parsedAmount, { onSuccess })
    } else if (operation === 'withdraw') {
      useWithdraw.mutate(parsedAmount, { onSuccess })
    }
  }

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
    <div className="p-8 flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-primary">Minha Carteira</h2>

      <Box className="w-fit min-w-72 items-start gap-1 py-6 px-8">
        <p className="text-foreground-variant text-sm">Saldo disponível</p>
        <p className="text-4xl font-bold text-primary">
          R$ {useBalance.data?.toFixed(2) ?? '0,00'}
        </p>
      </Box>

      <div className="flex gap-4">
        <Button
          variant={operation === 'deposit' ? 'gradient' : 'secondary'}
          label="Depositar"
          onClick={() => handleSelectOperation('deposit')}
          height="40px"
          className="flex items-center gap-2 w-36"
        />
        <Button
          variant={operation === 'withdraw' ? 'gradient' : 'secondary'}
          label="Sacar"
          onClick={() => handleSelectOperation('withdraw')}
          height="40px"
          className="flex items-center gap-2 w-36"
        />
      </div>

      {operation && (
        <Box className="w-fit min-w-72 items-start gap-4 py-6 px-8">
          <div className="flex items-center gap-2">
            {operation === 'deposit' ? (
              <ArrowDownToLine className="text-primary w-5 h-5" />
            ) : (
              <ArrowUpFromLine className="text-primary w-5 h-5" />
            )}
            <p className="text-foreground font-semibold">
              {operation === 'deposit' ? 'Depositar' : 'Sacar'}
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <p className="text-foreground-variant text-sm">Valor (R$)</p>
            <Input
              value={amount}
              type="number"
              placeholder="0,00"
              regex={/^\d*\.?\d{0,2}$/}
              onChange={(v) => setAmount(String(v))}
              className="w-full"
            />
          </div>

          <div className="flex gap-3 w-full">
            <Button
              variant="gradient"
              label="Confirmar"
              onClick={handleConfirm}
              disabled={!isValidAmount}
              isLoading={useDeposit.isPending || useWithdraw.isPending}
              height="40px"
              className="flex-1"
            />
            <Button
              variant="secondary"
              label="Cancelar"
              onClick={() => handleSelectOperation(null)}
              height="40px"
              className="flex-1"
            />
          </div>
        </Box>
      )}
    </div>
  )
}
