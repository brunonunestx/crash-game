import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { createLocalJWKSet, jwtVerify } from "jose";
import { AuthEngine } from "./auth.engine";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authEngine: AuthEngine) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader: string | undefined = request.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedException();
    }

    const token = authHeader.slice(7);
    const certs = this.authEngine.getCerts();

    if (!certs) {
      throw new UnauthorizedException("Auth service not ready");
    }

    const jwks = createLocalJWKSet(certs);
    const { payload } = await jwtVerify(token, jwks);

    request.user = payload;
    return true;
  }
}
