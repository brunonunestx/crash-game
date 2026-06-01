import { describe, it, expect, mock, beforeEach } from "bun:test";
import { CancelBet } from "../../../src/modules/bet/application/use-cases/cancel-bet.use-case";
import { Bet } from "../../../src/modules/bet/domain/entities/bet.entity";
import { Round } from "../../../src/modules/round/domain/entities/round.entity";
import { BetStatus } from "../../../generated/prisma/enums";

function makeActiveBet() {
  return new Bet({
    id: "bet-1",
    roundId: "round-1",
    userEmail: "user@test.com",
    amount: 500,
    status: BetStatus.ACTIVE,
  });
}

function makeBettingRound() {
  const round = new Round({ nounce: 1 });
  round.startBetting();
  return round;
}

function makePlayingRound() {
  const round = new Round({ nounce: 1 });
  round.startBetting();
  round.startPlaying();
  return round;
}

describe("CancelBet", () => {
  let betRepository: {
    getActiveBetByUserEmail: ReturnType<typeof mock>;
    updateBet: ReturnType<typeof mock>;
  };
  let getRound: { execute: ReturnType<typeof mock> };
  let useCase: CancelBet;

  beforeEach(() => {
    betRepository = {
      getActiveBetByUserEmail: mock(() => Promise.resolve(null)),
      updateBet: mock(() => Promise.resolve()),
    };
    getRound = { execute: mock(() => Promise.resolve(makeBettingRound())) };

    useCase = new CancelBet(betRepository as never, getRound as never);
  });

  it("cancela aposta e persiste bet com status CANCELED", async () => {
    const bet = makeActiveBet();
    betRepository.getActiveBetByUserEmail = mock(() => Promise.resolve(bet));

    await useCase.execute({ userEmail: "user@test.com" });

    expect(betRepository.updateBet).toHaveBeenCalledTimes(1);
    const updatedBet = betRepository.updateBet.mock.calls[0][0] as Bet;
    expect(updatedBet.status.isCancelled()).toBe(true);
  });

  it("lança erro se a rodada não está em BETTING", async () => {
    getRound.execute = mock(() => Promise.resolve(makePlayingRound()));
    betRepository.getActiveBetByUserEmail = mock(() =>
      Promise.resolve(makeActiveBet()),
    );

    await expect(
      useCase.execute({ userEmail: "user@test.com" }),
    ).rejects.toThrow("Cannot cancel bet in a round that is not betting.");

    expect(betRepository.updateBet).not.toHaveBeenCalled();
  });

  it("lança erro se não existe aposta ativa para o usuário", async () => {
    betRepository.getActiveBetByUserEmail = mock(() => Promise.resolve(null));

    await expect(
      useCase.execute({ userEmail: "user@test.com" }),
    ).rejects.toThrow("No active bet found for this user.");

    expect(betRepository.updateBet).not.toHaveBeenCalled();
  });
});
