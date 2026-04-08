import { CanActivate, Injectable, UnauthorizedException } from "@nestjs/common";
import type { ExecutionContext } from "@nestjs/common";

import { AuthService } from "./auth.service";
import type { AuthenticatedRequest } from "./auth.types";

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.authService.getTokenFromCookieHeader(
      request.headers.cookie,
    );
    const sessionUser = this.authService.getSessionUser(token);

    if (!sessionUser) {
      throw new UnauthorizedException({
        code: "auth_required",
        message: "Authentication is required for booking.",
      });
    }

    request.authUser = sessionUser;
    return true;
  }
}
