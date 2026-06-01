import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers["x-api-key"];

    const expected = process.env.INTERNAL_API_KEY;

    if (!expected) {
      throw new UnauthorizedException("INTERNAL_API_KEY not configured");
    }

    if (!apiKey || apiKey !== expected) {
      throw new UnauthorizedException("Invalid API key");
    }

    return true;
  }
}
