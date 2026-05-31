import { DatabaseService } from "@/providers/database/database.service";
import { Outbox } from "../../domain/entities/outbox.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OutboxRepository {
  constructor(private readonly database: DatabaseService) {}

  async saveBatch(messages: Outbox[]): Promise<void> {
    await this.database.outbox.createMany({
      data: messages.map((message) => ({
        eventType: message.eventType,
        userEmail: message.userEmail,
        amount: message.amount,
        processed: message.processed,
      })),
    });
  }

  async getPendingMessages(): Promise<Outbox[]> {
    const pendingMessages = await this.database.outbox.findMany({
      where: { processed: false },
    });

    return pendingMessages.map(
      (message) =>
        new Outbox({
          id: message.id,
          eventType: message.eventType,
          userEmail: message.userEmail,
          amount: message.amount,
          processed: message.processed,
        }),
    );
  }

  async markAsProcessed(ids: string[]): Promise<void> {
    await this.database.outbox.updateMany({
      where: { id: { in: ids } },
      data: { processed: true },
    });
  }
}
