import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import type { INestApplication } from "@nestjs/common";
import { AppModule } from "../../../src/app.module";
import { AuthEngine } from "../../../src/providers/auth/auth.engine";
import { getTestAuth } from "./jwt.helper";

export type TestApp = {
  app: INestApplication;
  baseUrl: string;
  token: (email: string) => Promise<string>;
  close: () => Promise<void>;
};

export async function startTestApp(port: number): Promise<TestApp> {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.setGlobalPrefix("games");
  app.enableCors({ origin: "*" });

  const auth = await getTestAuth();
  app.get(AuthEngine).certs = auth.jwks;

  await app.listen(port, "0.0.0.0");

  return {
    app,
    baseUrl: `http://localhost:${port}/games`,
    token: auth.token,
    close: () => app.close(),
  };
}
