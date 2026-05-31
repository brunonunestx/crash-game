export enum RoundStatus {
  STARTING = "STARTING",
  BETTING = "BETTING",
  PLAYING = "PLAYING",
  ENDED = "ENDED",
}

export interface IRound {
  id: string;
  number: number;
  hashedSeed: string;
  currentPoint: number;
  status: RoundStatus;
  createdAt: Date;
}
