import { ICreateBetInput } from "@crash-game/types";
import { IsInt, IsNumber } from "class-validator";

export class CreateBetDto implements ICreateBetInput {
  @IsNumber({}, { message: "Amount must be a number." })
  @IsInt({ message: "Amount must be an integer." })
  amount!: number;
}
