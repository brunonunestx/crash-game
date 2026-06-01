import { describe, it, expect, mock, beforeEach } from "bun:test";
import { FindWinnersUseCase } from "../../../src/modules/bet/application/use-cases/find-winners.use-case";
import { Bet } from "../../../src/modules/bet/domain/entities/bet.entity";
import { BetStatus } from "../../../generated/prisma/enums";

function makeCashedOutBet(id: string) {
  return new Bet({
    id,
    roundId: "round-1",
    userEmail: `user${id}@test.com`,
    amount: 500,
    status: BetStatus.CASHED_OUT,
    cashoutAt: 250,
  });
}

describe("FindWinnersUseCase", () => {
  let betRepository: { findWinnersByRoundId: ReturnType<typeof mock> };
  let useCase: FindWinnersUseCase;

  beforeEach(() => {
    betRepository = {
      findWinnersByRoundId: mock(() => Promise.resolve([])),
    };

    useCase = new FindWinnersUseCase(betRepository as never);
  });

  it("retorna lista de apostas CASHED_OUT da rodada", async () => {
    const winners = [makeCashedOutBet("a"), makeCashedOutBet("b")];
    betRepository.findWinnersByRoundId = mock(() => Promise.resolve(winners));

    const result = await useCase.execute({ roundId: "round-1" });

    expect(betRepository.findWinnersByRoundId).toHaveBeenCalledWith("round-1");
    expect(result).toHaveLength(2);
    expect(result.every((b) => b.status.isCashedOut())).toBe(true);
  });

  it("retorna lista vazia se não há vencedores", async () => {
    const result = await useCase.execute({ roundId: "round-1" });

    expect(result).toEqual([]);
  });
});
