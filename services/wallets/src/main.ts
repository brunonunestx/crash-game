import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { queueNames } from "@crash-game/constants/src/rabbitmq";
import { Transport } from "@nestjs/microservices/enums/transport.enum";
import { MicroserviceOptions } from "@nestjs/microservices/interfaces/microservice-configuration.interface";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("wallets");

  const config = new DocumentBuilder()
    .setTitle("Wallets Service")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || "amqp://localhost:5672"],
      queue: queueNames.crashGame,
      queueOptions: { durable: false },
    },
  });

  await app.startAllMicroservices();
  const port = process.env.PORT;
  if (!port) {
    throw new Error("PORT environment variable is not defined");
  }
  await app.listen(port, "0.0.0.0");
  console.log(`Wallets service running on port ${port}`);
}

bootstrap();
