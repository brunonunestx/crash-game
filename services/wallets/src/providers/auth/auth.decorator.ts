import { UseGuards, applyDecorators } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "./auth.guard";
import { ApiKeyGuard } from "./api-key.guard";

export const Authenticated = () =>
  applyDecorators(UseGuards(AuthGuard), ApiBearerAuth());

export const InternalOnly = () => applyDecorators(UseGuards(ApiKeyGuard));
