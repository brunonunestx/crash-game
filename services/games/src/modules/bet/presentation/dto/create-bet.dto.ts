import { ICreateBetInput } from "@crash-game/types";
import { IsInt, IsNumber, IsString, IsUUID } from "class-validator";

export class CreateBetDto implements ICreateBetInput {
  @IsString({ message: "Round ID must be a string." })
  @IsUUID("4", { message: "Round ID must be a valid UUID." })
  roundId!: string;

  @IsNumber({}, { message: "Amount must be a number." })
  @IsInt({ message: "Amount must be an integer." })
  amount!: number;
}
