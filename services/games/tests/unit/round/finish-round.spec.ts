import { describe, it, expect, mock, beforeEach } from "bun:test";
import { FinishRoundUseCase } from "../../../src/modules/round/application/use-cases/finish-round.use-case";

describe("FinishRoundUseCase", () => {
  let closeOpenedBetsUseCase: { execute: ReturnType<typeof mock> };
  let useCase: FinishRoundUseCase;

  beforeEach(() => {
    closeOpenedBetsUseCase = { execute: mock(() => Promise.resolve()) };
    useCase = new FinishRoundUseCase(closeOpenedBetsUseCase as never);
  });

  it("delega para CloseOpenedBetsUseCase com o roundId correto", async () => {
    await useCase.execute({ roundId: "round-99" });

    expect(closeOpenedBetsUseCase.execute).toHaveBeenCalledTimes(1);
    expect(closeOpenedBetsUseCase.execute).toHaveBeenCalledWith({
      roundId: "round-99",
    });
  });
});
