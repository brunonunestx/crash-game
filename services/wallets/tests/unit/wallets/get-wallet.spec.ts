import { describe, it, expect, mock, beforeEach } from "bun:test";
import { GetWalletUseCase } from "../../../src/modules/wallets/application/use-cases/get-wallet.use-case";
import { NotFoundException } from "@nestjs/common";

describe("GetWalletUseCase", () => {
  let walletRepository: { getWalletBalance: ReturnType<typeof mock> };
  let useCase: GetWalletUseCase;

  beforeEach(() => {
    walletRepository = {
      getWalletBalance: mock(() => Promise.resolve(0)),
    };
    useCase = new GetWalletUseCase(walletRepository as never);
  });

  it("retorna o saldo da carteira quando ela existe", async () => {
    walletRepository.getWalletBalance = mock(() => Promise.resolve(1500));

    const result = await useCase.execute("user@test.com");

    expect(walletRepository.getWalletBalance).toHaveBeenCalledWith("user@test.com");
    expect(result).toBe(1500);
  });

  it("propaga NotFoundException quando a carteira não existe", async () => {
    walletRepository.getWalletBalance = mock(() =>
      Promise.reject(new NotFoundException("Wallet not found")),
    );

    await expect(useCase.execute("user@test.com")).rejects.toThrow(
      NotFoundException,
    );
    await expect(useCase.execute("user@test.com")).rejects.toThrow(
      "Wallet not found",
    );
  });
});
