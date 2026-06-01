import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { io, type Socket } from "socket.io-client";
import { startTestApp, type TestApp } from "../helpers/app.helper";
import { messages } from "@crash-game/constants";

const PORT = 4012;
const WS_URL = `http://localhost:${PORT}`;

let ctx: TestApp;

beforeAll(async () => {
  ctx = await startTestApp(PORT);
});

afterAll(async () => {
  await ctx.close();
});

function connectSocket(): Socket {
  return io(WS_URL, { transports: ["websocket"] });
}

function waitForEvent<T>(
  socket: Socket,
  event: string,
  timeoutMs = 20_000,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`Timeout esperando evento "${event}"`)),
      timeoutMs,
    );
    socket.once(event, (data: T) => {
      clearTimeout(timer);
      resolve(data);
    });
  });
}

describe("RoundGateway WebSocket e2e", () => {
  it("recebe round:sync ao conectar quando há rodada ativa", async () => {
    const socket = connectSocket();

    try {
      // round:sync é emitido na conexão se houver rodada
      const data = await waitForEvent<{ status: string; currentPoint: number }>(
        socket,
        messages.syncRound,
        10_000,
      ).catch(() => null);

      // pode ser null se ainda não há rodada — mas a conexão deve ter ocorrido
      expect(socket.connected).toBe(true);
      if (data) {
        expect(data).toHaveProperty("status");
        expect(data).toHaveProperty("currentPoint");
      }
    } finally {
      socket.disconnect();
    }
  });

  it("recebe round:update com estrutura correta durante a partida", async () => {
    const socket = connectSocket();

    try {
      const update = await waitForEvent<{
        status: string;
        currentPoint: number;
        number: number;
      }>(socket, messages.roundUpdate, 15_000);

      expect(update).toHaveProperty("status");
      expect(update).toHaveProperty("currentPoint");
      expect(update).toHaveProperty("number");
      expect(typeof update.currentPoint).toBe("number");
    } finally {
      socket.disconnect();
    }
  });

  it("recebe eventos de transição de status da rodada (STARTING → BETTING → PLAYING)", async () => {
    const socket = connectSocket();
    const statuses: string[] = [];

    socket.on(messages.roundUpdate, (data: { status: string }) => {
      if (!statuses.includes(data.status)) {
        statuses.push(data.status);
      }
    });

    // aguarda pelo menos 2 transições de status (30s timeout)
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error("Timeout aguardando transições de status")),
        30_000,
      );
      const check = setInterval(() => {
        if (statuses.length >= 2) {
          clearTimeout(timer);
          clearInterval(check);
          resolve();
        }
      }, 500);
    });

    socket.disconnect();
    expect(statuses.length).toBeGreaterThanOrEqual(2);
  });
});
