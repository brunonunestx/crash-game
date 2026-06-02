import { cronTimes } from "@crash-game/constants";
import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InboxRepository } from "../../infrastructure/repositories/inbox.repository";
import { CreateLedgerItemUseCase } from "@/modules/ledger/application/use-cases/create-ledger.use-case";

@Injectable()
export class InboxWorker {
  private readonly logger = new Logger(InboxWorker.name);

  constructor(
    private readonly inboxRepository: InboxRepository,
    private readonly createLedgerItemUseCase: CreateLedgerItemUseCase,
  ) {}

  @Cron(cronTimes.every.second)
  async execute() {
    const pendingMessages = await this.inboxRepository.findPendingMessages();

    if (pendingMessages.length === 0) return;

    this.logger.log(
      `Found ${pendingMessages.length} pending messages in the inbox.`,
    );

    const processedIds: string[] = [];

    for (const message of pendingMessages) {
      try {
        await this.createLedgerItemUseCase.execute({
          userEmail: message.payload.userEmail,
          amount: message.payload.amount,
          type: message.eventType,
        });

        message.markAsProcessed();
        processedIds.push(message.id);
      } catch (err) {
        this.logger.error(
          `Failed to process inbox message ${message.id} for user ${message.payload.userEmail}: ${(err as Error).message}`,
        );
      }
    }

    if (processedIds.length > 0) {
      await this.inboxRepository.saveBatchAsProcessed(processedIds);
    }
  }
}
