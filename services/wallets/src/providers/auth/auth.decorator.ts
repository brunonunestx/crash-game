import { UseGuards, applyDecorators } from "@nestjs/common";
import { AuthGuard } from "./auth.guard";

export const Authenticated = () => applyDecorators(UseGuards(AuthGuard));
