import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { startTestApp, type TestApp } from "../helpers/app.helper";

const PORT = 4021;
const USER = "wallet-e2e@test.com";

let ctx: TestApp;
let token: string;

async function get(path: string) {
  return fetch(`${ctx.baseUrl}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

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
  const res = await get("/me");
  const body = await res.json();
  return body.balance;
}

beforeAll(async () => {
  ctx = await startTestApp(PORT);
  token = await ctx.token(USER);
});

afterAll(async () => {
  await ctx.close();
});

describe("Wallet HTTP e2e", () => {
  it("cria carteira com sucesso", async () => {
    const res = await post("/");
    expect(res.status).toBe(201);
  });

  it("retorna saldo inicial 0 após criação", async () => {
    const balance = await getBalance();
    expect(balance).toBe(0);
  });

  it("deposita valor e o saldo reflete corretamente", async () => {
    const res = await post("/deposit", { amount: 1000 });
    expect(res.status).toBe(201);

    // ledger atualiza saldo de forma síncrona via createLedger → updateBalance
    const balance = await getBalance();
    expect(balance).toBe(1000);
  });

  it("realiza saque e saldo é debitado", async () => {
    const res = await post("/withdraw", { amount: 300 });
    expect(res.status).toBe(201);

    const balance = await getBalance();
    expect(balance).toBe(700);
  });

  it("retorna 400 ao tentar sacar mais do que o saldo disponível", async () => {
    const res = await post("/withdraw", { amount: 9999 });
    expect(res.status).toBe(400);

    // saldo não muda
    const balance = await getBalance();
    expect(balance).toBe(700);
  });

  it("retorna 400 ao tentar sacar com saldo zerado", async () => {
    await post("/withdraw", { amount: 700 });

    const res = await post("/withdraw", { amount: 1 });
    expect(res.status).toBe(400);
  });
});
