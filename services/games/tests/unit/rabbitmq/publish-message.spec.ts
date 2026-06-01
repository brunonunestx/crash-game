import { describe, it, expect, mock, beforeEach } from "bun:test";
import { PublishMessagesUseCase } from "../../../src/providers/rabbitmq/application/use-cases/publish-message.use-case";
import { Outbox } from "../../../src/providers/rabbitmq/domain/entities/outbox.entity";
import { EventType } from "../../../generated/prisma/enums";

describe("PublishMessagesUseCase", () => {
  let outboxRepository: { saveBatch: ReturnType<typeof mock> };
  let useCase: PublishMessagesUseCase;

  beforeEach(() => {
    outboxRepository = { saveBatch: mock(() => Promise.resolve()) };
    useCase = new PublishMessagesUseCase(outboxRepository as never);
  });

  it("mapeia DTOs para instâncias Outbox e persiste o batch", async () => {
    await useCase.execute({
      messages: [
        { eventType: EventType.BET_DONE, userEmail: "u@test.com", amount: 500 },
      ],
    });

    expect(outboxRepository.saveBatch).toHaveBeenCalledTimes(1);
    const [batch] = outboxRepository.saveBatch.mock.calls[0] as [Outbox[]];
    expect(batch).toHaveLength(1);
    expect(batch[0]).toBeInstanceOf(Outbox);
    expect(batch[0].eventType).toBe(EventType.BET_DONE);
    expect(batch[0].userEmail).toBe("u@test.com");
    expect(batch[0].amount).toBe(500);
  });

  it("persiste múltiplas mensagens em uma única chamada saveBatch", async () => {
    await useCase.execute({
      messages: [
        { eventType: EventType.BET_DONE, userEmail: "a@test.com", amount: 100 },
        { eventType: EventType.BET_WINNER, userEmail: "b@test.com", amount: 300 },
      ],
    });

    expect(outboxRepository.saveBatch).toHaveBeenCalledTimes(1);
    const [batch] = outboxRepository.saveBatch.mock.calls[0] as [Outbox[]];
    expect(batch).toHaveLength(2);
    expect(batch[0].eventType).toBe(EventType.BET_DONE);
    expect(batch[1].eventType).toBe(EventType.BET_WINNER);
  });
});
