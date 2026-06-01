import { UseCase } from "@/shared/patterns/use-case";
import { RoundRepository } from "../../infrastructure/repositories/round.repository";
import { Injectable } from "@nestjs/common";
import { GetHistoryDto } from "../../presentation/dto/round.dto";
import { Round } from "../../domain/entities/round.entity";

@Injectable()
export class GetRoundHistory extends UseCase<GetHistoryDto, Round[]> {
  constructor(private readonly roundRepository: RoundRepository) {
    super();
  }
  async execute(payload: GetHistoryDto): Promise<Round[]> {
    const lastCurrent = await this.roundRepository.getLastRounds(
      payload.page,
      payload.limit,
    );

    return lastCurrent;
  }
}
