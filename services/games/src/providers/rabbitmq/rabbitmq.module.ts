import { queueNames } from "@crash-game/constants";
import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

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
  providers: [],
  exports: [],
})
export class RabbitMQModule {}
