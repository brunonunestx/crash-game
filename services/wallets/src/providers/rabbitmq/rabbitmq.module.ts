import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { queueNames } from "@crash-game/constants";
import { Subscriber } from "./application/subscriber/message.subscriber";
import { RegisterInbox } from "./application/use-cases/register-inbox.use-case";
import { InboxRepository } from "./infrastructure/repositories/inbox.repository";
import { InboxWorker } from "./application/worker/inbox.worker";

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
  providers: [RegisterInbox, InboxRepository, InboxWorker, Subscriber],
  controllers: [Subscriber],
})
export class RabbitMQModule {}
