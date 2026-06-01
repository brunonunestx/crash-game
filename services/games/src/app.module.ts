import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { modules } from "./modules";
import { providers } from "./providers";
import { HealthController } from "./health.controller";

@Module({
  imports: [ScheduleModule.forRoot(), ...modules, ...providers],
  controllers: [HealthController],
})
export class AppModule {}
