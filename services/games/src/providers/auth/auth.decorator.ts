import { UseGuards, applyDecorators } from "@nestjs/common";
import { AuthGuard } from "./auth.guard";
import { ApiKeyGuard } from "./api-key.guard";

export const Authenticated = () => applyDecorators(UseGuards(AuthGuard));

export const InternalOnly = () => applyDecorators(UseGuards(ApiKeyGuard));
