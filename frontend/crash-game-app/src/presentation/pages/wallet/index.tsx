import { isAxiosNotFound, useWallet } from '#/data/queries/wallets/use-wallet'
import { useLedger } from '#/data/queries/wallets/use-ledger'
import type { LedgerEntry, LedgerEntryType } from '#/data/repositories/wallets/ledger/repository'
import { Box } from '#/presentation/components/box'
import { Button } from '#/presentation/components/button'
import { Input } from '#/presentation/components/input'
import { ArrowDownToLine, ArrowUpFromLine, ChevronLeft, ChevronRight, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import React, { useState } from 'react'

type Operation = 'deposit' | 'withdraw' | null

export function WalletPage() {
  const { useBalance, useCreateWallet, useDeposit, useWithdraw } = useWallet()
  const [operation, setOperation] = useState<Operation>(null)
  const [amount, setAmount] = useState('')
  const [page, setPage] = useState(1)
  const LIMIT = 10
  const { data: ledger, isLoading: ledgerLoading } = useLedger(page, LIMIT)

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

      <Box className="w-fit min-w-80 items-start gap-1 py-6 px-8 border-primary/30 bg-primary/5">
        <p className="text-foreground-variant text-sm">Saldo disponível</p>
        <p className="text-4xl font-bold text-primary">
          {(useBalance.data ?? 0).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
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

      {operation !== null && (
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
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-foreground">
          Histórico de transações
        </h3>

        <Box className="w-full items-start gap-0 p-0 overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto] text-xs text-foreground-variant px-5 py-2 border-b border-white/5 w-full gap-4">
            <span>Tipo</span>
            <span className="text-right w-28">Valor</span>
            <span className="text-right w-32">Data</span>
          </div>

          {ledgerLoading ? (
            <div className="py-10 w-full flex items-center justify-center">
              <p className="text-foreground-variant text-sm animate-pulse">
                Carregando...
              </p>
            </div>
          ) : ledger?.ledgerItems.length === 0 ? (
            <div className="py-10 w-full flex items-center justify-center">
              <p className="text-foreground-variant text-sm">
                Nenhuma transação encontrada
              </p>
            </div>
          ) : (
            ledger?.ledgerItems.map((entry) => (
              <LedgerRow key={entry.id} entry={entry} />
            ))
          )}
        </Box>

        {ledger && ledger.totalPages > 1 && (
          <div className="flex items-center justify-between text-sm text-foreground-variant">
            <span>
              Página {ledger.currentPage} de {ledger.totalPages} —{' '}
              {ledger.totalItems} transações
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1 rounded hover:text-primary disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() =>
                  setPage((p) => Math.min(ledger.totalPages, p + 1))
                }
                disabled={page === ledger.totalPages}
                className="p-1 rounded hover:text-primary disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const typeConfig: Record<
  LedgerEntryType,
  { label: string; badgeClass: string; icon: React.ReactNode }
> = {
  DEPOSIT: {
    label: 'Depósito',
    badgeClass: 'text-green-400 bg-green-400/10 border-green-400/20',
    icon: <ArrowDownToLine size={12} />,
  },
  WITHDRAW: {
    label: 'Saque',
    badgeClass: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    icon: <ArrowUpFromLine size={12} />,
  },
  WIN: {
    label: 'Ganho',
    badgeClass: 'text-green-400 bg-green-400/10 border-green-400/20',
    icon: <TrendingUp size={12} />,
  },
  LOSS: {
    label: 'Perda',
    badgeClass: 'text-red-400 bg-red-400/10 border-red-400/20',
    icon: <TrendingDown size={12} />,
  },
}

function LedgerRow({ entry }: { entry: LedgerEntry }) {
  const config = typeConfig[entry.type]
  const isPositive = entry.type === 'DEPOSIT' || entry.type === 'WIN'

  return (
    <div className="grid grid-cols-[1fr_auto_auto] text-sm px-5 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors w-full gap-4 items-center">
      <span
        className={`inline-flex items-center gap-1.5 self-start w-fit px-2 py-0.5 rounded-full border text-xs font-medium ${config.badgeClass}`}
      >
        {config.icon}
        {config.label}
      </span>
      <span
        className={`text-right font-medium tabular-nums w-28 ${isPositive ? 'text-green-400' : 'text-red-400'}`}
      >
        {isPositive ? '+' : '-'}{' '}
        {entry.amount.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
      </span>
      <span className="text-right text-foreground-variant text-xs w-32">
        {new Date(entry.createdAt).toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </span>
    </div>
  )
}
