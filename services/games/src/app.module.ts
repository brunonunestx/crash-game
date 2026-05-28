import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { modules } from "./modules";
import { providers } from "./providers";

@Module({
  imports: [ScheduleModule.forRoot(), ...modules, ...providers],
  controllers: [],
})
export class AppModule {}
