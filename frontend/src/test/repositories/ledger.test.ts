import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LedgerRepository } from '#/data/repositories/wallets/ledger/repository'

const mockGet = vi.fn()

vi.mock('axios', () => ({
  default: {
    create: () => ({
      get: mockGet,
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    }),
  },
}))

describe('LedgerRepository.getHistory', () => {
  let repo: LedgerRepository

  beforeEach(() => {
    vi.clearAllMocks()
    repo = new LedgerRepository()
  })

  it('converte amounts de centavos para double', async () => {
    mockGet.mockResolvedValue({
      data: {
        ledgerItems: [
          { id: '1', amount: 5000, type: 'DEPOSIT', createdAt: '2026-01-01' },
          { id: '2', amount: 200, type: 'LOSS', createdAt: '2026-01-02' },
        ],
        currentPage: 1,
        itemsPerPage: 20,
        totalPages: 1,
        totalItems: 2,
      },
    })

    const result = await repo.getHistory('user@test.com', 1, 20)

    expect(result.ledgerItems[0].amount).toBe(50)
    expect(result.ledgerItems[1].amount).toBe(2)
  })

  it('preserva os metadados de paginação', async () => {
    mockGet.mockResolvedValue({
      data: {
        ledgerItems: [],
        currentPage: 2,
        itemsPerPage: 10,
        totalPages: 5,
        totalItems: 47,
      },
    })

    const result = await repo.getHistory('user@test.com', 2, 10)

    expect(result.currentPage).toBe(2)
    expect(result.totalPages).toBe(5)
    expect(result.totalItems).toBe(47)
  })

  it('passa os parâmetros corretos para a requisição', async () => {
    mockGet.mockResolvedValue({
      data: { ledgerItems: [], currentPage: 1, itemsPerPage: 20, totalPages: 0, totalItems: 0 },
    })

    await repo.getHistory('user@test.com', 3, 20, 'asc')

    expect(mockGet).toHaveBeenCalledWith('', {
      params: { userEmail: 'user@test.com', page: 3, limit: 20, orderBy: 'asc' },
    })
  })

  it('usa orderBy desc por padrão', async () => {
    mockGet.mockResolvedValue({
      data: { ledgerItems: [], currentPage: 1, itemsPerPage: 20, totalPages: 0, totalItems: 0 },
    })

    await repo.getHistory('user@test.com', 1, 20)

    expect(mockGet).toHaveBeenCalledWith('', expect.objectContaining({
      params: expect.objectContaining({ orderBy: 'desc' }),
    }))
  })
})
