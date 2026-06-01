import { ICreateBetInput } from "@crash-game/types";
import { IsInt, IsNumber, Max, Min } from "class-validator";

const MIN_BET_CENTS = 100;    // R$ 1,00
const MAX_BET_CENTS = 100_000; // R$ 1.000,00

export class CreateBetDto implements ICreateBetInput {
  @IsNumber({}, { message: "Amount must be a number." })
  @IsInt({ message: "Amount must be an integer." })
  @Min(MIN_BET_CENTS, { message: `Minimum bet is R$ ${MIN_BET_CENTS / 100}.` })
  @Max(MAX_BET_CENTS, { message: `Maximum bet is R$ ${MAX_BET_CENTS / 100}.` })
  amount!: number;
}
