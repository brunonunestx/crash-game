import { Module } from "@nestjs/common";
import { providers } from "./providers";
import { ScheduleModule } from "@nestjs/schedule";
import { modules } from "./modules";
import { HealthController } from "./health.controller";

@Module({
  imports: [...providers, ...modules, ScheduleModule.forRoot()],
  controllers: [HealthController],
})
export class AppModule {}
