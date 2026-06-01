import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database/database.module";
import { RabbitMQModule } from "./rabbitmq/rabbitmq.module";

export const providers = [DatabaseModule, RabbitMQModule, AuthModule];
