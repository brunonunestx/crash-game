import { UseCase } from "@/shared/patterns/use-case";
import { CreateBetDto } from "../../presentation/dto/create-bet.dto";

export class CreateBet extends UseCase<
  CreateBetDto & { userId: string },
  void
> {
  async execute(input: CreateBetDto & { userId: string }): Promise<void> {
    console.log("Received CreateBet input:", input);
    return;
  }
}
