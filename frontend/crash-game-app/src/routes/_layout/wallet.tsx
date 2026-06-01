import { WalletPage } from '#/presentation/pages/wallet'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/wallet')({
  component: WalletPage,
})
