import { Entity } from "@/shared/patterns/entity";
import { createHash, randomBytes } from "node:crypto";
import { RoundState } from "../value-objects/round-state.vo";
import { createHmac } from "crypto";
import { RoundStatus } from "generated/prisma/enums";

type ConstructorParams = {
  id?: string;
  seed?: string;
  nounce: number;
  status?: RoundStatus;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Round extends Entity {
  id: string;
  seed!: string;
  hashedSeed!: string;
  number: number;
  currentPoint: number;
  breakPoint: number;
  status: RoundState;
  createdAt: Date;
  updatedAt: Date;

  constructor({
    id,
    seed,
    nounce,
    status,
    createdAt,
    updatedAt,
  }: ConstructorParams) {
    super();
    this.id = id || crypto.randomUUID();
    if (seed) {
      this.seed = seed;
    } else {
      this.generateSeed();
    }
    this.hashedSeed = this.hashServerSeed();
    this.number = nounce;
    this.currentPoint = 100;
    this.breakPoint = this.calculateCrashPoint();
    this.status = new RoundState(status || RoundStatus.STARTING);
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  startBetting() {
    this.status = new RoundState(RoundStatus.BETTING);
    this.updatedAt = new Date();
  }

  startPlaying() {
    this.status = new RoundState(RoundStatus.PLAYING);
    this.updatedAt = new Date();
  }

  endRound() {
    this.status = new RoundState(RoundStatus.ENDED);
    this.updatedAt = new Date();
  }

  incrementPoint() {
    this.currentPoint += 1;
    this.updatedAt = new Date();
  }

  calculateCrashPoint() {
    if (process.env.TEST_CRASH_POINT) {
      return parseInt(process.env.TEST_CRASH_POINT, 10);
    }

    const hmac = createHmac("sha256", this.seed)
      .update(this.number.toString())
      .digest("hex");

    const int = parseInt(hmac.slice(0, 13), 16);

    const e = Math.pow(2, 52);
    const crashPoint = Math.floor((100 * e) / (e - int));

    return crashPoint;
  }

  private generateSeed() {
    this.seed = randomBytes(32).toString("hex");
  }

  private hashServerSeed() {
    return createHash("sha256").update(this.seed).digest("hex");
  }
}
