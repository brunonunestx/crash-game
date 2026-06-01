import { DatabaseService } from "@/providers/database/database.service";
import { Inbox } from "../../domain/entities/inbox.entity";
import { Injectable } from "@nestjs/common";
import { MessageDTO } from "../../presentation/dto/message.dto";

@Injectable()
export class InboxRepository {
  constructor(private readonly database: DatabaseService) {}

  async findExistingMessage(messageId: string) {
    return await this.database.inbox.findUnique({ where: { messageId } });
  }

  async findPendingMessages() {
    const pendingMessages = await this.database.inbox.findMany({
      where: { processed: false },
    });

    return pendingMessages.map(
      (message) =>
        new Inbox({
          id: message.id,
          payload: message.payload as unknown as MessageDTO,
          eventType: message.eventType,
          messageId: message.messageId,
          processed: message.processed,
          createdAt: message.createdAt,
        }),
    );
  }

  async save(inbox: Inbox): Promise<void> {
    await this.database.inbox.create({
      data: {
        id: inbox.id,
        payload: inbox.payload,
        eventType: inbox.eventType,
        messageId: inbox.messageId,
        processed: inbox.processed,
        createdAt: inbox.createdAt,
      },
    });
  }

  async saveBatchAsProcessed(ids: string[]): Promise<void> {
    await this.database.inbox.updateMany({
      where: { id: { in: ids } },
      data: { processed: true },
    });
  }
}
