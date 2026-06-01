import { BetHistoryPage } from '#/presentation/pages/bet-history'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/bet-history')({
  component: BetHistoryPage,
})
