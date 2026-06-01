import { describe, it, expect, mock, beforeEach } from "bun:test";
import { CreateLedgerItemUseCase } from "../../../src/modules/ledger/application/use-cases/create-ledger.use-case";
import { Ledger } from "../../../src/modules/ledger/domain/entities/ledger.entity";
import { EventType, TransactionType } from "../../../generated/prisma/enums";

describe("CreateLedgerItemUseCase", () => {
  let ledgerRepository: {
    save: ReturnType<typeof mock>;
    getCurrentBalance: ReturnType<typeof mock>;
  };
  let updateBalanceUseCase: { execute: ReturnType<typeof mock> };
  let useCase: CreateLedgerItemUseCase;

  beforeEach(() => {
    ledgerRepository = {
      save: mock(() => Promise.resolve()),
      getCurrentBalance: mock(() => Promise.resolve(1000)),
    };
    updateBalanceUseCase = { execute: mock(() => Promise.resolve()) };
    useCase = new CreateLedgerItemUseCase(
      ledgerRepository as never,
      updateBalanceUseCase as never,
    );
  });

  it("mapeia BET_DONE → LOSS, persiste ledger e atualiza saldo", async () => {
    await useCase.execute({ userEmail: "u@test.com", amount: 500, type: EventType.BET_DONE });

    const ledger = ledgerRepository.save.mock.calls[0][0] as Ledger;
    expect(ledger).toBeInstanceOf(Ledger);
    expect(ledger.type).toBe(TransactionType.LOSS);
    expect(ledger.amount).toBe(500);
    expect(updateBalanceUseCase.execute).toHaveBeenCalledWith("u@test.com", 1000);
  });

  it("mapeia BET_WINNER → WIN, persiste ledger e atualiza saldo", async () => {
    await useCase.execute({ userEmail: "u@test.com", amount: 750, type: EventType.BET_WINNER });

    const ledger = ledgerRepository.save.mock.calls[0][0] as Ledger;
    expect(ledger.type).toBe(TransactionType.WIN);
    expect(ledger.amount).toBe(750);
  });

  it("mapeia DEPOSIT → DEPOSIT, persiste ledger e atualiza saldo", async () => {
    await useCase.execute({ userEmail: "u@test.com", amount: 200, type: TransactionType.DEPOSIT });

    const ledger = ledgerRepository.save.mock.calls[0][0] as Ledger;
    expect(ledger.type).toBe(TransactionType.DEPOSIT);
  });

  it("mapeia WITHDRAW → WITHDRAW, persiste ledger e atualiza saldo", async () => {
    await useCase.execute({ userEmail: "u@test.com", amount: 100, type: TransactionType.WITHDRAW });

    const ledger = ledgerRepository.save.mock.calls[0][0] as Ledger;
    expect(ledger.type).toBe(TransactionType.WITHDRAW);
  });

  it("chama updateBalanceUseCase com o saldo calculado pelo ledger", async () => {
    ledgerRepository.getCurrentBalance = mock(() => Promise.resolve(3500));

    await useCase.execute({ userEmail: "u@test.com", amount: 100, type: TransactionType.DEPOSIT });

    expect(ledgerRepository.getCurrentBalance).toHaveBeenCalledWith("u@test.com");
    expect(updateBalanceUseCase.execute).toHaveBeenCalledWith("u@test.com", 3500);
  });
});
