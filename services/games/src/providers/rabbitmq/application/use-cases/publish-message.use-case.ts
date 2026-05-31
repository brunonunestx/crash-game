import { UseCase } from "@/shared/patterns/use-case";
import { PublishMessageDto } from "../../presentation/dto/publish-message.dto";
import { Outbox } from "../../domain/entities/outbox.entity";
import { Injectable } from "@nestjs/common";
import { OutboxRepository } from "../../infrastructure/repositories/outbox.repository";

@Injectable()
export class PublishMessagesUseCase extends UseCase<PublishMessageDto, void> {
  constructor(private readonly outboxRepository: OutboxRepository) {
    super();
  }

  async execute({ messages }: PublishMessageDto): Promise<void> {
    const outboxMessages = messages.map(
      (message) =>
        new Outbox({
          eventType: message.eventType,
          userEmail: message.userEmail,
          amount: message.amount,
        }),
    );

    await this.outboxRepository.saveBatch(outboxMessages);
  }
}
