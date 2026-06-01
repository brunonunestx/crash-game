import { describe, it, expect, mock, beforeEach } from "bun:test";
import { GetRound } from "../../../src/modules/round/application/use-cases/get-round.use-case";
import { RoundEngine } from "../../../src/modules/round/application/engine/round.engine";
import { Round } from "../../../src/modules/round/domain/entities/round.entity";
import { InternalServerErrorException } from "@nestjs/common";

describe("GetRound", () => {
  let roundEngine: RoundEngine;
  let useCase: GetRound;

  beforeEach(() => {
    roundEngine = new RoundEngine();
    useCase = new GetRound(roundEngine);
  });

  it("retorna a rodada atual do engine", async () => {
    const round = new Round({ nounce: 1 });
    roundEngine.setCurrentRound(round);

    const result = await useCase.execute();

    expect(result).toBe(round);
  });

  it("lança InternalServerErrorException quando não há rodada em execução", async () => {
    // engine começa sem rodada
    await expect(useCase.execute()).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(useCase.execute()).rejects.toThrow(
      "No round is currently running",
    );
  });
});
