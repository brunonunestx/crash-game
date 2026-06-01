import { describe, it, expect, mock, beforeEach } from "bun:test";
import { CashOutUseCase } from "../../../src/modules/bet/application/use-cases/cash-out.use-case";
import { Bet } from "../../../src/modules/bet/domain/entities/bet.entity";
import { Round } from "../../../src/modules/round/domain/entities/round.entity";
import { BetStatus, EventType } from "../../../generated/prisma/enums";

function makeActiveBet() {
  return new Bet({
    id: "bet-1",
    roundId: "round-1",
    userEmail: "user@test.com",
    amount: 1000,
    status: BetStatus.ACTIVE,
  });
}

function makeRoundWithStatus(status: "PLAYING" | "BETTING") {
  const round = new Round({ nounce: 1 });
  round.startBetting();
  if (status === "PLAYING") {
    round.startPlaying();
    for (let i = 0; i < 150; i++) round.incrementPoint();
  }
  return round;
}

describe("CashOutUseCase", () => {
  let betRepository: {
    getActiveBetByUserEmail: ReturnType<typeof mock>;
    updateBet: ReturnType<typeof mock>;
  };
  let getRound: { execute: ReturnType<typeof mock> };
  let publishMessagesUseCase: { execute: ReturnType<typeof mock> };
  let useCase: CashOutUseCase;

  beforeEach(() => {
    betRepository = {
      getActiveBetByUserEmail: mock(() => Promise.resolve(null)),
      updateBet: mock(() => Promise.resolve()),
    };
    getRound = { execute: mock(() => Promise.resolve(null)) };
    publishMessagesUseCase = { execute: mock(() => Promise.resolve()) };

    useCase = new CashOutUseCase(
      betRepository as never,
      getRound as never,
      publishMessagesUseCase as never,
    );
  });

  it("realiza cash out, persiste bet com CASHED_OUT e publica BET_WINNER com payout correto", async () => {
    const round = makeRoundWithStatus("PLAYING");
    const bet = makeActiveBet();
    getRound.execute = mock(() => Promise.resolve(round));
    betRepository.getActiveBetByUserEmail = mock(() => Promise.resolve(bet));

    const result = await useCase.execute({ userEmail: "user@test.com" });

    expect(betRepository.updateBet).toHaveBeenCalledTimes(1);
    const updatedBet = betRepository.updateBet.mock.calls[0][0] as Bet;
    expect(updatedBet.status.isCashedOut()).toBe(true);
    expect(updatedBet.cashoutAt).toBe(round.currentPoint);

    const expectedPayout = bet.calculatePayout();
    expect(publishMessagesUseCase.execute).toHaveBeenCalledWith({
      messages: [
        expect.objectContaining({
          eventType: EventType.BET_WINNER,
          userEmail: "user@test.com",
          amount: expectedPayout,
        }),
      ],
    });

    expect(result.multiplier).toBe(round.currentPoint);
    expect(result.cashoutAmount).toBe(expectedPayout);
  });

  it("lança erro se a rodada não está em PLAYING", async () => {
    const round = makeRoundWithStatus("BETTING");
    getRound.execute = mock(() => Promise.resolve(round));

    await expect(
      useCase.execute({ userEmail: "user@test.com" }),
    ).rejects.toThrow("Cannot cash out in a round that is not still playing.");

    expect(betRepository.updateBet).not.toHaveBeenCalled();
    expect(publishMessagesUseCase.execute).not.toHaveBeenCalled();
  });

  it("lança erro se não existe aposta ativa para o usuário", async () => {
    const round = makeRoundWithStatus("PLAYING");
    getRound.execute = mock(() => Promise.resolve(round));
    betRepository.getActiveBetByUserEmail = mock(() => Promise.resolve(null));

    await expect(
      useCase.execute({ userEmail: "user@test.com" }),
    ).rejects.toThrow("No active bet found for this user.");

    expect(betRepository.updateBet).not.toHaveBeenCalled();
  });
});
