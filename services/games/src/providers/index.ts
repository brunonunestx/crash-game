import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database/database.module";
import { LoggerModule } from "./logger/logger.module";
import { RabbitMQModule } from "./rabbitmq/rabbitmq.module";

export const providers = [
  LoggerModule,
  DatabaseModule,
  AuthModule,
  RabbitMQModule,
];
