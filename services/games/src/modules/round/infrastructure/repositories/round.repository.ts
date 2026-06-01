import { DatabaseService } from "@/providers/database/database.service";
import { Round } from "../../domain/entities/round.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RoundRepository {
  constructor(private readonly database: DatabaseService) {}

  async createRound(round: Round) {
    await this.database.round.create({
      data: {
        id: round.id,
        nounce: round.number,
        serverSeed: round.seed,
        status: round.status.getValue(),
      },
    });
  }

  async updateRound(round: Round) {
    await this.database.round.update({
      where: { id: round.id },
      data: {
        status: round.status.getValue(),
      },
    });
  }

  async getLastRoundNumber() {
    const lastRound = await this.database.round.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return lastRound?.nounce || 0;
  }

  async findEndedRoundById(id: string): Promise<Round | null> {
    const data = await this.database.round.findFirst({
      where: { id, status: "ENDED" },
    });

    if (!data) return null;

    return new Round({ id: data.id, nounce: data.nounce, seed: data.serverSeed, status: data.status });
  }

  async getLastRounds(page: number, limit: number): Promise<Round[]> {
    const roundsData = await this.database.round.findMany({
      orderBy: { createdAt: "desc" },
      where: { status: "ENDED" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return roundsData.map(
      (data) =>
        new Round({
          id: data.id,
          nounce: data.nounce,
          seed: data.serverSeed,
          status: data.status,
        }),
    );
  }
}
