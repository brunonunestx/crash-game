import { describe, it, expect, mock, beforeEach } from "bun:test";
import { RegisterInbox } from "../../../src/providers/rabbitmq/application/use-cases/register-inbox.use-case";
import { Inbox } from "../../../src/providers/rabbitmq/domain/entities/inbox.entity";
import { EventType } from "../../../generated/prisma/enums";

const messagePayload = {
  id: "msg-uuid-1",
  userEmail: "user@test.com",
  amount: 500,
};

describe("RegisterInbox", () => {
  let inboxRepository: {
    findExistingMessage: ReturnType<typeof mock>;
    save: ReturnType<typeof mock>;
  };
  let useCase: RegisterInbox;

  beforeEach(() => {
    inboxRepository = {
      findExistingMessage: mock(() => Promise.resolve(null)),
      save: mock(() => Promise.resolve()),
    };
    useCase = new RegisterInbox(inboxRepository as never);
  });

  it("persiste a mensagem quando o messageId ainda não existe", async () => {
    await useCase.execute(EventType.BET_DONE, messagePayload);

    expect(inboxRepository.findExistingMessage).toHaveBeenCalledWith(
      messagePayload.id,
    );
    expect(inboxRepository.save).toHaveBeenCalledTimes(1);
    const inbox = inboxRepository.save.mock.calls[0][0] as Inbox;
    expect(inbox).toBeInstanceOf(Inbox);
    expect(inbox.messageId).toBe(messagePayload.id);
    expect(inbox.eventType).toBe(EventType.BET_DONE);
  });

  it("não persiste e retorna silenciosamente quando messageId já existe (idempotência)", async () => {
    const existingInbox = new Inbox({
      payload: messagePayload,
      eventType: EventType.BET_DONE,
    });
    inboxRepository.findExistingMessage = mock(() =>
      Promise.resolve(existingInbox),
    );

    await useCase.execute(EventType.BET_DONE, messagePayload);

    expect(inboxRepository.save).not.toHaveBeenCalled();
  });
});
