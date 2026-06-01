import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import type { INestApplication } from "@nestjs/common";
import { Transport } from "@nestjs/microservices";
import { AppModule } from "../../../src/app.module";
import { AuthEngine } from "../../../src/providers/auth/auth.engine";
import { queueNames } from "@crash-game/constants/src/rabbitmq";
import { getTestAuth } from "./jwt.helper";

export type TestApp = {
  app: INestApplication;
  baseUrl: string;
  token: (email: string) => Promise<string>;
  close: () => Promise<void>;
};

export async function startTestApp(port: number): Promise<TestApp> {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.setGlobalPrefix("wallets");
  app.enableCors({ origin: "*" });

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL ?? "amqp://admin:admin@localhost:5674"],
      queue: queueNames.crashGame,
      queueOptions: { durable: false },
    },
  });

  const auth = await getTestAuth();
  app.get(AuthEngine).certs = auth.jwks;

  await app.startAllMicroservices();
  await app.listen(port, "0.0.0.0");

  return {
    app,
    baseUrl: `http://localhost:${port}/wallets`,
    token: auth.token,
    close: () => app.close(),
  };
}
