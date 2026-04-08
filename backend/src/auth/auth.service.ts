import { Injectable } from "@nestjs/common";

import { env } from "../config/env";
import type { AuthSessionUser } from "./auth.types";
import type { LoginInput } from "./auth.schemas";

type SessionRecord = {
  token: string;
  user: AuthSessionUser;
  expiresAt: number;
};

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

@Injectable()
export class AuthService {
  private readonly sessions = new Map<string, SessionRecord>();

  createSession(input: LoginInput) {
    const normalizedEmail = input.email.trim().toLowerCase();
    const user = {
      id: normalizedEmail,
      name: input.name.trim(),
      email: normalizedEmail,
    } satisfies AuthSessionUser;

    const token = crypto.randomUUID();
    const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;

    this.sessions.set(token, {
      token,
      user,
      expiresAt,
    });

    return {
      token,
      user,
    };
  }

  getSessionUser(token: string | null | undefined) {
    if (!token) {
      return null;
    }

    const session = this.sessions.get(token);

    if (!session) {
      return null;
    }

    if (session.expiresAt <= Date.now()) {
      this.sessions.delete(token);
      return null;
    }

    return session.user;
  }

  destroySession(token: string | null | undefined) {
    if (token) {
      this.sessions.delete(token);
    }
  }

  getSessionCookieValue(token: string) {
    return [
      `${env.SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
      "Path=/",
      "HttpOnly",
      "SameSite=Lax",
      `Max-Age=${SESSION_MAX_AGE_SECONDS}`,
    ].join("; ");
  }

  getClearedSessionCookieValue() {
    return [
      `${env.SESSION_COOKIE_NAME}=`,
      "Path=/",
      "HttpOnly",
      "SameSite=Lax",
      "Max-Age=0",
    ].join("; ");
  }

  getTokenFromCookieHeader(cookieHeader: string | undefined) {
    if (!cookieHeader) {
      return null;
    }

    const cookies = cookieHeader.split(";").map((part) => part.trim());

    for (const cookie of cookies) {
      const [rawName, ...rawValueParts] = cookie.split("=");

      if (rawName === env.SESSION_COOKIE_NAME) {
        return decodeURIComponent(rawValueParts.join("="));
      }
    }

    return null;
  }
}
