import { useQuery } from '@tanstack/react-query'
import { repositories } from '#/data/repositories'

function getUserEmailFromToken(): string | null {
  try {
    const raw = localStorage.getItem('user_tokens')
    if (!raw) return null
    const { access_token } = JSON.parse(raw) as { access_token: string }
    const payload = JSON.parse(atob(access_token.split('.')[1]))
    return payload.email ?? null
  } catch {
    return null
  }
}

export const ledgerQueryKey = (page: number, limit: number) =>
  ['wallet', 'ledger', page, limit] as const

export function useLedger(
  page = 1,
  limit = 20,
  orderBy: 'asc' | 'desc' = 'desc',
) {
  const userEmail = getUserEmailFromToken()

  return useQuery({
    queryKey: ledgerQueryKey(page, limit),
    queryFn: () =>
      repositories.wallets.ledger.getHistory(userEmail!, page, limit, orderBy),
    enabled: !!userEmail,
  })
}
