import { describe, it, expect, mock, beforeEach } from "bun:test";
import { CreateWalletUseCase } from "../../../src/modules/wallets/application/use-cases/create-wallet.use-case";
import { Wallet } from "../../../src/modules/wallets/domain/entities/wallet.entity";
import { WalletStatus } from "../../../generated/prisma/enums";

describe("CreateWalletUseCase", () => {
  let walletRepository: { save: ReturnType<typeof mock> };
  let useCase: CreateWalletUseCase;

  beforeEach(() => {
    walletRepository = { save: mock(() => Promise.resolve()) };
    useCase = new CreateWalletUseCase(walletRepository as never);
  });

  it("cria carteira com saldo 0, status ACTIVE e persiste", async () => {
    await useCase.execute("user@test.com");

    expect(walletRepository.save).toHaveBeenCalledTimes(1);
    const wallet = walletRepository.save.mock.calls[0][0] as Wallet;
    expect(wallet).toBeInstanceOf(Wallet);
    expect(wallet.owner).toBe("user@test.com");
    expect(wallet.balance).toBe(0);
    expect(wallet.status.getValue()).toBe(WalletStatus.ACTIVE);
  });
});
