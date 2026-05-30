import { Module } from "@nestjs/common";
import { BetController } from "./presentation/controllers/running-bet.controller";
import { CreateBet } from "./application/use-cases/create-bet.use-case";

@Module({
  controllers: [BetController],
  providers: [CreateBet],
})
export class BetModule {}
