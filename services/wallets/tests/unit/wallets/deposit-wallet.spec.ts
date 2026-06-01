import { describe, it, expect, mock, beforeEach } from "bun:test";
import { DepositWalletUseCase } from "../../../src/modules/wallets/application/use-cases/deposit-wallet.use-case";
import { TransactionType } from "../../../generated/prisma/enums";

describe("DepositWalletUseCase", () => {
  let walletRepository: object;
  let createLedger: { execute: ReturnType<typeof mock> };
  let useCase: DepositWalletUseCase;

  beforeEach(() => {
    walletRepository = {};
    createLedger = { execute: mock(() => Promise.resolve()) };
    useCase = new DepositWalletUseCase(
      walletRepository as never,
      createLedger as never,
    );
  });

  it("chama createLedger com tipo DEPOSIT, amount e email corretos", async () => {
    await useCase.execute("user@test.com", 1000);

    expect(createLedger.execute).toHaveBeenCalledTimes(1);
    expect(createLedger.execute).toHaveBeenCalledWith({
      userEmail: "user@test.com",
      amount: 1000,
      type: TransactionType.DEPOSIT,
    });
  });

  it("propaga erro se createLedger falhar", async () => {
    createLedger.execute = mock(() =>
      Promise.reject(new Error("Ledger failure")),
    );

    await expect(useCase.execute("user@test.com", 1000)).rejects.toThrow(
      "Ledger failure",
    );
  });
});
