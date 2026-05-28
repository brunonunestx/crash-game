import { Entity } from "@/shared/patterns/entity";
import { createHash, randomBytes } from "node:crypto";
import { RoundState } from "../value-objects/round-state.vo";
import { createHmac } from "crypto";
import { RoundStatus } from "generated/prisma/enums";

type ConstructorParams = {
  seed?: string;
  nounce: number;
};

export class Round extends Entity {
  seed!: string;
  hashedSeed!: string;
  number: number;
  currentPoint: number;
  status: RoundState;
  createdAt: Date;
  updatedAt: Date;

  constructor({ seed, nounce }: ConstructorParams) {
    super();
    if (seed) {
      this.seed = seed;
    } else {
      this.generateSeed();
    }
    this.hashedSeed = this.hashServerSeed();
    this.number = nounce;
    this.currentPoint = 100;
    this.status = new RoundState(RoundStatus.STARTING);
    this.createdAt = new Date();
    this.updatedAt = new Date();
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
