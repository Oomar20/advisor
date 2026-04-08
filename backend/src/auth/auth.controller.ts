import { Body, Controller, Get, Post, Req, Res, UsePipes } from "@nestjs/common";
import type { FastifyReply } from "fastify";

import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { AuthService } from "./auth.service";
import { loginSchema, type LoginInput } from "./auth.schemas";
import type { AuthenticatedRequest } from "./auth.types";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("session")
  getSession(@Req() request: AuthenticatedRequest) {
    const token = this.authService.getTokenFromCookieHeader(request.headers.cookie);
    const user = this.authService.getSessionUser(token);

    return {
      user,
    };
  }

  @Post("login")
  @UsePipes(new ZodValidationPipe(loginSchema))
  login(
    @Body() body: LoginInput,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    const session = this.authService.createSession(body);

    reply.header("Set-Cookie", this.authService.getSessionCookieValue(session.token));

    return {
      message: "Signed in successfully.",
      user: session.user,
    };
  }

  @Post("logout")
  logout(
    @Req() request: AuthenticatedRequest,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    const token = this.authService.getTokenFromCookieHeader(request.headers.cookie);
    this.authService.destroySession(token);
    reply.header("Set-Cookie", this.authService.getClearedSessionCookieValue());

    return {
      message: "Signed out successfully.",
    };
  }
}
