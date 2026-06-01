import { describe, it, expect, mock, beforeEach } from "bun:test";
import { CreateBet } from "../../../src/modules/bet/application/use-cases/create-bet.use-case";
import { Bet } from "../../../src/modules/bet/domain/entities/bet.entity";
import { Round } from "../../../src/modules/round/domain/entities/round.entity";
import { BetStatus, EventType } from "../../../generated/prisma/enums";

function makeBet(
  overrides: Partial<ConstructorParameters<typeof Bet>[0]> = {},
) {
  return new Bet({
    id: "bet-1",
    roundId: "round-1",
    userEmail: "user@test.com",
    amount: 500,
    status: BetStatus.ACTIVE,
    ...overrides,
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

describe("CreateBet", () => {
  let betRepository: {
    getActiveBetByUserEmail: ReturnType<typeof mock>;
    createBet: ReturnType<typeof mock>;
  };
  let getRound: { execute: ReturnType<typeof mock> };
  let publishMessagesUseCase: { execute: ReturnType<typeof mock> };
  let useCase: CreateBet;

  beforeEach(() => {
    const round = makeBettingRound();

    betRepository = {
      getActiveBetByUserEmail: mock(() => Promise.resolve(null)),
      createBet: mock((bet: Bet) => Promise.resolve(bet)),
    };
    getRound = { execute: mock(() => Promise.resolve(round)) };
    publishMessagesUseCase = { execute: mock(() => Promise.resolve()) };

    const fetchMock = mock(() =>
      Promise.resolve({
        json: () => Promise.resolve({ canBet: true }),
      } as Response),
    );
    global.fetch = fetchMock as never;

    useCase = new CreateBet(
      betRepository as never,
      getRound as never,
      publishMessagesUseCase as never,
    );
  });

  it("cria aposta, persiste e publica evento BET_DONE", async () => {
    const input = { userEmail: "user@test.com", amount: 500 };

    const result = await useCase.execute(input);

    expect(betRepository.createBet).toHaveBeenCalledTimes(1);
    const createdBet = betRepository.createBet.mock.calls[0][0] as Bet;
    expect(createdBet.userEmail).toBe("user@test.com");
    expect(createdBet.amount).toBe(500);
    expect(createdBet.status.isActive()).toBe(true);

    expect(publishMessagesUseCase.execute).toHaveBeenCalledWith({
      messages: [
        expect.objectContaining({
          eventType: EventType.BET_DONE,
          userEmail: "user@test.com",
          amount: 500,
        }),
      ],
    });

    expect(result).toBeInstanceOf(Bet);
  });

  it("lança erro se usuário já tem aposta ativa", async () => {
    betRepository.getActiveBetByUserEmail = mock(() =>
      Promise.resolve(makeBet()),
    );

    await expect(
      useCase.execute({ userEmail: "user@test.com", amount: 500 }),
    ).rejects.toThrow("User already has an active bet.");
  });

  it("lança erro se getRound falhar (sem rodada ativa)", async () => {
    getRound.execute = mock(() =>
      Promise.reject(new Error("No round is currently running")),
    );

    await expect(
      useCase.execute({ userEmail: "user@test.com", amount: 500 }),
    ).rejects.toThrow("No round is currently running");

    expect(betRepository.createBet).not.toHaveBeenCalled();
    expect(publishMessagesUseCase.execute).not.toHaveBeenCalled();
  });
});
