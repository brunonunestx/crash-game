import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import type { INestApplication } from "@nestjs/common";
import { AppModule } from "../../../src/app.module";
import { AuthEngine } from "../../../src/providers/auth/auth.engine";
import { AuthCron } from "../../../src/providers/auth/auth.cron";
import { SendMessageWorker } from "../../../src/providers/rabbitmq/application/workers/send-message.worker";
import { getTestAuth } from "./jwt.helper";

export type TestApp = {
  app: INestApplication;
  baseUrl: string;
  token: (email: string) => Promise<string>;
  close: () => Promise<void>;
};

export async function startTestApp(port: number): Promise<TestApp> {
  process.env.TEST_CRASH_POINT = "110"; // 1.10x — PLAYING dura ~1s nos testes

  const app = await NestFactory.create(AppModule, { logger: false });
  app.setGlobalPrefix("games");
  app.enableCors({ origin: "*" });

  const auth = await getTestAuth();
  app.get(AuthEngine).certs = auth.jwks;

  // Impede o cron de sobrescrever os certs de teste com os do Keycloak real
  app.get(AuthCron).handleCron = async () => {};

  // Impede publicação no RabbitMQ real durante os testes
  app.get(SendMessageWorker).sendMessage = async () => {};

  await app.listen(port, "0.0.0.0");

  return {
    app,
    baseUrl: `http://localhost:${port}/games`,
    token: auth.token,
    close: () =>
      Promise.race([
        app.close(),
        new Promise<void>((resolve) => setTimeout(resolve, 8_000)),
      ]),
  };
}
