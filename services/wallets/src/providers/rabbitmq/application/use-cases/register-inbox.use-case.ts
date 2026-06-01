import { EventType } from "generated/prisma/enums";
import { MessageDTO } from "../../presentation/dto/message.dto";
import { Inbox } from "../../domain/entities/inbox.entity";
import { Injectable } from "@nestjs/common";
import { InboxRepository } from "../../infrastructure/repositories/inbox.repository";

@Injectable()
export class RegisterInbox {
  constructor(private readonly inboxRepository: InboxRepository) {}
  async execute(eventType: EventType, payload: MessageDTO): Promise<void> {
    const inbox = new Inbox({
      payload: {
        id: payload.id,
        userEmail: payload.userEmail,
        amount: payload.amount,
      },
      eventType,
    });

    const existingMessage = await this.inboxRepository.findExistingMessage(
      inbox.messageId,
    );

    if (existingMessage) {
      console.log(
        `Message with id ${inbox.messageId} already exists in the inbox.`,
      );
      return;
    }

    await this.inboxRepository.save(inbox);
  }
}
