import { cronTimes } from "@crash-game/constants";
import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InboxRepository } from "../../infrastructure/repositories/inbox.repository";
import { CreateLedgerItemUseCase } from "@/modules/ledger/application/use-cases/create-ledger.use-case";

@Injectable()
export class InboxWorker {
  constructor(
    private readonly inboxRepository: InboxRepository,
    private readonly createLedgerItemUseCase: CreateLedgerItemUseCase,
  ) {}

  @Cron(cronTimes.every.second)
  async execute() {
    const pendingMessages = await this.inboxRepository.findPendingMessages();

    console.log(
      `Found ${pendingMessages.length} pending messages in the inbox.`,
    );

    const processedMessages = [];
    for (const message of pendingMessages) {
      await this.createLedgerItemUseCase.execute({
        userEmail: message.payload.userEmail,
        amount: message.payload.amount,
        type: message.eventType,
      });

      message.markAsProcessed();
      processedMessages.push(message);
    }

    await this.inboxRepository.saveBatchAsProcessed(
      processedMessages.map((m) => m.id),
    );
  }
}
