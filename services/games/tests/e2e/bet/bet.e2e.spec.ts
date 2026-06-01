import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { startTestApp, type TestApp } from "../helpers/app.helper";
import { RoundStatus } from "../../../generated/prisma/enums";

const PORT = 4011;
const USER = "bet-e2e@test.com";

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

async function waitForRoundStatus(
  status: string,
  timeoutMs = 30_000,
): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const res = await get("/round/current").catch(() => null);
    if (res?.ok) {
      const body = await res.json();
      if (body.status === status) return;
    }
    await Bun.sleep(500);
  }
  throw new Error(`Timeout aguardando rodada no status ${status}`);
}

beforeAll(async () => {
  ctx = await startTestApp(PORT);
  token = await ctx.token(USER);
});

afterAll(async () => {
  await ctx.close();
});

describe("Bet HTTP e2e", () => {
  it("aguarda uma rodada entrar em BETTING e cria uma aposta", async () => {
    await waitForRoundStatus(RoundStatus.BETTING);

    const res = await post("/bet", { amount: 100 });
    expect(res.status).toBe(201);
  });

  it("retorna erro ao tentar criar segunda aposta na mesma rodada", async () => {
    // aposta já existe do teste anterior
    const res = await post("/bet", { amount: 50 });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it("cancela a aposta enquanto a rodada está em BETTING", async () => {
    await waitForRoundStatus(RoundStatus.BETTING);

    const res = await post("/bet/cancel");
    expect(res.status).toBe(201);
  });

  it("cria aposta e realiza cash out quando rodada está em PLAYING", async () => {
    await waitForRoundStatus(RoundStatus.BETTING);
    await post("/bet", { amount: 100 });

    await waitForRoundStatus(RoundStatus.PLAYING);

    const res = await post("/bet/cashout");
    expect(res.status).toBe(201);

    const body = await res.json();
    expect(body).toHaveProperty("multiplier");
    expect(body).toHaveProperty("cashoutAmount");
    expect(body.multiplier).toBeGreaterThanOrEqual(100);
  });

  it("retorna erro ao tentar cash out fora do estado PLAYING", async () => {
    // após o cash out do teste anterior, não há aposta ativa
    const res = await post("/bet/cashout");
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});
