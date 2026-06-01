import amqplib, { type Channel, type Connection } from "amqplib";
import { queueNames } from "@crash-game/constants/src/rabbitmq";

export type AmqpPublisher = {
  publish: (pattern: string, data: object) => void;
  close: () => Promise<void>;
};

export async function createAmqpPublisher(): Promise<AmqpPublisher> {
  const url =
    process.env.RABBITMQ_URL ?? "amqp://admin:admin@localhost:5674";

  const conn: Connection = await amqplib.connect(url);
  const channel: Channel = await conn.createChannel();

  await channel.assertQueue(queueNames.crashGame, { durable: false });

  return {
    // NestJS RabbitMQ transport espera { pattern, data }
    publish: (pattern: string, data: object) => {
      const msg = JSON.stringify({ pattern, data });
      channel.sendToQueue(
        queueNames.crashGame,
        Buffer.from(msg),
        { contentType: "application/json" },
      );
    },
    close: async () => {
      await channel.close();
      await conn.close();
    },
  };
}
