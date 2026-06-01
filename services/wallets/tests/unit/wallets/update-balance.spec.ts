import { describe, it, expect, mock, beforeEach } from "bun:test";
import { UpdateBalanceUseCase } from "../../../src/modules/wallets/application/use-cases/update-balance.use-case";
import { NotFoundException } from "@nestjs/common";

describe("UpdateBalanceUseCase", () => {
  let walletRepository: { updateWalletBalance: ReturnType<typeof mock> };
  let useCase: UpdateBalanceUseCase;

  beforeEach(() => {
    walletRepository = {
      updateWalletBalance: mock(() => Promise.resolve()),
    };
    useCase = new UpdateBalanceUseCase(walletRepository as never);
  });

  it("chama updateWalletBalance com email e amount corretos", async () => {
    await useCase.execute("user@test.com", 2000);

    expect(walletRepository.updateWalletBalance).toHaveBeenCalledTimes(1);
    expect(walletRepository.updateWalletBalance).toHaveBeenCalledWith(
      "user@test.com",
      2000,
    );
  });

  it("propaga NotFoundException quando a carteira não existe", async () => {
    walletRepository.updateWalletBalance = mock(() =>
      Promise.reject(new NotFoundException("Wallet not found")),
    );

    await expect(useCase.execute("user@test.com", 500)).rejects.toThrow(
      NotFoundException,
    );
  });
});
