import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { io } from "socket.io-client";
import { startTestApp, type TestApp } from "../helpers/app.helper";
import { messages } from "@crash-game/constants";
import { RoundStatus } from "../../../generated/prisma/enums";

const PORT = 4011;
const USER = "bet-e2e@test.com";

let ctx: TestApp;
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

function waitForRoundStatus(
  status: string,
  timeoutMs = 30_000,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const wsUrl = ctx.baseUrl.replace("/games", "");
    const socket = io(wsUrl, { transports: ["websocket"] });
    const timer = setTimeout(() => {
      socket.disconnect();
      reject(new Error(`Timeout aguardando rodada no status ${status}`));
    }, timeoutMs);

    function check(data: { status: string }) {
      if (data.status === status) {
        clearTimeout(timer);
        socket.disconnect();
        resolve();
      }
    }

    socket.on(messages.syncRound, check);
    socket.on(messages.roundUpdate, check);
    socket.on("connect_error", (err) => {
      clearTimeout(timer);
      socket.disconnect();
      reject(err);
    });
  });
}

beforeAll(async () => {
  ctx = await startTestApp(PORT);
  token = await ctx.token(USER);
}, 30_000);

afterAll(async () => {
  await ctx.close();
}, 15_000);

describe("Bet HTTP e2e", () => {
  it("aguarda uma rodada entrar em BETTING e cria uma aposta", async () => {
    await waitForRoundStatus(RoundStatus.BETTING);

    const res = await post("/bet", { amount: 100 });
    expect(res.status).toBe(201);
  }, 40_000);

  it("retorna erro ao tentar criar segunda aposta na mesma rodada", async () => {
    const res = await post("/bet", { amount: 50 });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it("cancela a aposta enquanto a rodada está em BETTING", async () => {
    await waitForRoundStatus(RoundStatus.BETTING);

    const res = await post("/bet/cancel");
    expect(res.status).toBe(201);
  }, 40_000);

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
  }, 40_000);

  it("retorna erro ao tentar cash out fora do estado PLAYING", async () => {
    const res = await post("/bet/cashout");
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});
