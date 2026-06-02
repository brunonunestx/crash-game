import { describe, it, expect, beforeEach } from "bun:test";
import { createHash, createHmac } from "node:crypto";
import { Round } from "../../../src/modules/round/domain/entities/round.entity";
import { RoundStatus } from "../../../generated/prisma/enums";

describe("Round — ciclo de vida", () => {
  let round: Round;

  beforeEach(() => {
    round = new Round({ nounce: 1 });
  });

  it("inicia no estado STARTING", () => {
    expect(round.status.getValue()).toBe(RoundStatus.STARTING);
  });

  it("transição STARTING → BETTING", () => {
    round.startBetting();
    expect(round.status.isBetting()).toBe(true);
  });

  it("transição BETTING → PLAYING", () => {
    round.startBetting();
    round.startPlaying();
    expect(round.status.isPlaying()).toBe(true);
  });

  it("transição PLAYING → ENDED", () => {
    round.startBetting();
    round.startPlaying();
    round.endRound();
    expect(round.status.isEnded()).toBe(true);
  });

  it("gera id único por instância", () => {
    const other = new Round({ nounce: 2 });
    expect(round.id).not.toBe(other.id);
  });

  it("currentPoint começa em 100 (1.00x)", () => {
    expect(round.currentPoint).toBe(100);
  });

  it("incrementPoint aumenta currentPoint em 1", () => {
    round.incrementPoint();
    round.incrementPoint();
    expect(round.currentPoint).toBe(102);
  });

  it("breakPoint é sempre >= 100 (>= 1.00x)", () => {
    for (let i = 0; i < 20; i++) {
      const r = new Round({ nounce: i });
      expect(r.breakPoint).toBeGreaterThanOrEqual(100);
    }
  });

  it("aceita seed externa e reconstrói o mesmo breakPoint", () => {
    const seed = round.seed;
    const nounce = round.number;
    const rebuilt = new Round({ seed, nounce });
    expect(rebuilt.breakPoint).toBe(round.breakPoint);
  });
});

describe("Round — Provably Fair", () => {
  it("hashedSeed é SHA-256 do seed", () => {
    const round = new Round({ nounce: 1 });
    const expected = createHash("sha256").update(round.seed).digest("hex");
    expect(round.hashedSeed).toBe(expected);
  });

  it("breakPoint é determinístico dado seed + nounce", () => {
    const seed = "abc123defseed";
    const r1 = new Round({ seed, nounce: 7 });
    const r2 = new Round({ seed, nounce: 7 });
    expect(r1.breakPoint).toBe(r2.breakPoint);
  });

  it("breakPoint muda ao trocar nounce (mesmo seed)", () => {
    const seed = "abc123defseed";
    const r1 = new Round({ seed, nounce: 1 });
    const r2 = new Round({ seed, nounce: 2 });
    expect(r1.breakPoint).not.toBe(r2.breakPoint);
  });

  it("breakPoint muda ao trocar seed (mesmo nounce)", () => {
    const r1 = new Round({ seed: "seedA", nounce: 5 });
    const r2 = new Round({ seed: "seedB", nounce: 5 });
    expect(r1.breakPoint).not.toBe(r2.breakPoint);
  });

  it("jogador pode verificar o crash point conhecendo o seed", () => {
    const round = new Round({ nounce: 42 });

    const hmac = createHmac("sha256", round.seed)
      .update(round.number.toString())
      .digest("hex");

    const int = parseInt(hmac.slice(0, 13), 16);
    const e = Math.pow(2, 52);
    const verified = Math.floor((100 * e) / (e - int));

    expect(verified).toBe(round.breakPoint);
  });

  it("hashedSeed antes da rodada permite verificar a seed depois", () => {
    const round = new Round({ nounce: 1 });
    const hashedSeedBeforeRound = round.hashedSeed;

    const recomputed = createHash("sha256").update(round.seed).digest("hex");
    expect(recomputed).toBe(hashedSeedBeforeRound);
  });
});
