import { cronTimes } from "@crash-game/constants";
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices/client/client-proxy";
import { Cron } from "@nestjs/schedule";
import { OutboxRepository } from "../../infrastructure/repositories/outbox.repository";

@Injectable()
export class SendMessageWorker {
  constructor(
    @Inject("RABBITMQ_SERVICE")
    private readonly client: ClientProxy,
    private readonly outboxRepository: OutboxRepository,
  ) {}

  @Cron(cronTimes.every.fiveSeconds)
  async sendMessage() {
    const pendingMessages = await this.outboxRepository.getPendingMessages();

    const sentMessages = [];
    for (const message of pendingMessages) {
      this.client.emit(message.eventType, {
        id: message.id,
        userEmail: message.userEmail,
        amount: message.amount,
      });
      message.markAsProcessed();
      sentMessages.push(message);
    }

    if (sentMessages.length > 0) {
      await this.outboxRepository.markAsProcessed(
        sentMessages.map((m) => m.id),
      );
    }
  }
}
