import { cronTimes } from "@crash-game/constants";
import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InboxRepository } from "../../infrastructure/repositories/inbox.repository";

@Injectable()
export class InboxWorker {
  constructor(private readonly inboxRepository: InboxRepository) {}

  @Cron(cronTimes.every.second)
  async execute() {
    const pendingMessages = await this.inboxRepository.findPendingMessages();

    console.log(
      `Found ${pendingMessages.length} pending messages in the inbox.`,
    );

    const processedMessages = [];
    for (const message of pendingMessages) {
      console.log(
        `Processing message with id ${message.id} and event type ${message.eventType}`,
      );

      message.markAsProcessed();
      processedMessages.push(message);
    }

    await this.inboxRepository.saveBatchAsProcessed(
      processedMessages.map((m) => m.id),
    );
  }
}
