import { describe, it, expect, mock, beforeEach } from "bun:test";
import { WithdrawWalletUseCase } from "../../../src/modules/wallets/application/use-cases/withdraw-wallet.use-case";
import { BadRequestException } from "@nestjs/common";
import { TransactionType } from "../../../generated/prisma/enums";

describe("WithdrawWalletUseCase", () => {
  let walletRepository: { getWalletBalance: ReturnType<typeof mock> };
  let createLedger: { execute: ReturnType<typeof mock> };
  let useCase: WithdrawWalletUseCase;

  beforeEach(() => {
    walletRepository = {
      getWalletBalance: mock(() => Promise.resolve(2000)),
    };
    createLedger = { execute: mock(() => Promise.resolve()) };
    useCase = new WithdrawWalletUseCase(
      walletRepository as never,
      createLedger as never,
    );
  });

  it("cria entrada WITHDRAW no ledger quando saldo é suficiente", async () => {
    await useCase.execute("user@test.com", 500);

    expect(createLedger.execute).toHaveBeenCalledTimes(1);
    expect(createLedger.execute).toHaveBeenCalledWith({
      userEmail: "user@test.com",
      amount: 500,
      type: TransactionType.WITHDRAW,
    });
  });

  it("lança BadRequestException quando saldo < amount", async () => {
    walletRepository.getWalletBalance = mock(() => Promise.resolve(100));

    await expect(useCase.execute("user@test.com", 500)).rejects.toThrow(
      BadRequestException,
    );
    await expect(useCase.execute("user@test.com", 500)).rejects.toThrow(
      "Saldo insuficiente",
    );
    expect(createLedger.execute).not.toHaveBeenCalled();
  });

  it("lança BadRequestException quando saldo é 0 e amount > 0", async () => {
    walletRepository.getWalletBalance = mock(() => Promise.resolve(0));

    await expect(useCase.execute("user@test.com", 1)).rejects.toThrow(
      BadRequestException,
    );
    expect(createLedger.execute).not.toHaveBeenCalled();
  });
});
