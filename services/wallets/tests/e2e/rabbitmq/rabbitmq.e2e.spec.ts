import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { startTestApp, type TestApp } from "../helpers/app.helper";
import { createAmqpPublisher, type AmqpPublisher } from "../helpers/amqp.helper";
import { EventType } from "../../../generated/prisma/enums";

const PORT = 4022;
const USER = "rmq-e2e@test.com";

let ctx: TestApp;
let publisher: AmqpPublisher;
let token: string;

async function post(path: string, body?: object) {
  return fetch(`${ctx.baseUrl}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

async function getBalance(): Promise<number> {
  const res = await fetch(`${ctx.baseUrl}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await res.json();
  return body.balance;
}

async function waitForBalance(
  expectedBalance: number,
  timeoutMs = 10_000,
): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const balance = await getBalance();
    if (balance === expectedBalance) return;
    await Bun.sleep(300);
  }
  const actual = await getBalance();
  throw new Error(
    `Timeout: saldo esperado ${expectedBalance}, atual ${actual}`,
  );
}

beforeAll(async () => {
  ctx = await startTestApp(PORT);
  publisher = await createAmqpPublisher();
  token = await ctx.token(USER);

  await post("/");
  await post("/deposit", { amount: 5000 });
  await waitForBalance(5000);
});

afterAll(async () => {
  await publisher.close();
  await ctx.close();
});

describe("RabbitMQ integration e2e (wallets)", () => {
  it("BET_DONE debita o amount da carteira via fila", async () => {
    const msgId = crypto.randomUUID();

    publisher.publish(EventType.BET_DONE, {
      id: msgId,
      userEmail: USER,
      amount: 500,
    });

    await waitForBalance(4500);
    const balance = await getBalance();
    expect(balance).toBe(4500);
  });

  it("BET_WINNER credita o payout na carteira via fila", async () => {
    const msgId = crypto.randomUUID();

    publisher.publish(EventType.BET_WINNER, {
      id: msgId,
      userEmail: USER,
      amount: 1200,
    });

    await waitForBalance(5700);
    const balance = await getBalance();
    expect(balance).toBe(5700);
  });

  it("mensagem duplicada não processa duas vezes (idempotência)", async () => {
    const msgId = crypto.randomUUID();
    const payload = { id: msgId, userEmail: USER, amount: 300 };

    publisher.publish(EventType.BET_DONE, payload);
    publisher.publish(EventType.BET_DONE, payload);

    await waitForBalance(5400);
    await Bun.sleep(2000); // tempo extra para garantir que a segunda não processou

    const balance = await getBalance();
    expect(balance).toBe(5400); // debitou apenas uma vez
  });
});
