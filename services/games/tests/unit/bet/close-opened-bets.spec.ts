import { describe, it, expect, mock, beforeEach } from "bun:test";
import { CloseOpenedBetsUseCase } from "../../../src/modules/bet/application/use-cases/close-opened-bets.use-case";
import { Bet } from "../../../src/modules/bet/domain/entities/bet.entity";
import { BetStatus } from "../../../generated/prisma/enums";

function makeActiveBet(id: string) {
  return new Bet({
    id,
    roundId: "round-1",
    userEmail: `user${id}@test.com`,
    amount: 500,
    status: BetStatus.ACTIVE,
  });
}

describe("CloseOpenedBetsUseCase", () => {
  let betRepository: {
    findOpenedBetsByRoundId: ReturnType<typeof mock>;
    closeManyBets: ReturnType<typeof mock>;
  };
  let useCase: CloseOpenedBetsUseCase;

  beforeEach(() => {
    betRepository = {
      findOpenedBetsByRoundId: mock(() => Promise.resolve([])),
      closeManyBets: mock(() => Promise.resolve()),
    };

    useCase = new CloseOpenedBetsUseCase(betRepository as never);
  });

  it("marca todas as apostas abertas como LOST e persiste em batch", async () => {
    const bets = [makeActiveBet("a"), makeActiveBet("b"), makeActiveBet("c")];
    betRepository.findOpenedBetsByRoundId = mock(() =>
      Promise.resolve(bets),
    );

    await useCase.execute({ roundId: "round-1" });

    expect(betRepository.findOpenedBetsByRoundId).toHaveBeenCalledWith("round-1");
    expect(betRepository.closeManyBets).toHaveBeenCalledTimes(1);

    const closedBets = betRepository.closeManyBets.mock.calls[0][0] as Bet[];
    expect(closedBets).toHaveLength(3);
    expect(closedBets.every((b) => b.status.isLost())).toBe(true);
  });

  it("chama closeManyBets com array vazio se não há apostas abertas", async () => {
    betRepository.findOpenedBetsByRoundId = mock(() => Promise.resolve([]));

    await useCase.execute({ roundId: "round-1" });

    expect(betRepository.closeManyBets).toHaveBeenCalledWith([]);
  });
});
