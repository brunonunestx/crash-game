import { queueNames } from "@crash-game/constants";
import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { SendMessageWorker } from "./application/workers/send-message.worker";
import { PublishMessagesUseCase } from "./application/use-cases/publish-message.use-case";
import { OutboxRepository } from "./infrastructure/repositories/outbox.repository";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "RABBITMQ_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || "amqp://localhost:5672"],
          queue: queueNames.crashGame,
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  providers: [SendMessageWorker, PublishMessagesUseCase, OutboxRepository],
  exports: [PublishMessagesUseCase],
})
export class RabbitMQModule {}
