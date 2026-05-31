import { Module } from "@nestjs/common";
import { BetController } from "./presentation/controllers/running-bet.controller";
import { CreateBet } from "./application/use-cases/create-bet.use-case";
import { AuthModule } from "@/providers/auth/auth.module";
import { BetRepository } from "./infrastructure/repositories/bet.repository";

@Module({
  imports: [AuthModule],
  controllers: [BetController],
  providers: [CreateBet, BetRepository],
})
export class BetModule {}
