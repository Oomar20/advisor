import { cookies } from "next/headers";

import type { SessionUser } from "@/lib/auth";
import { BACKEND_API_BASE_URL, parseBackendPayload } from "@/lib/backend-proxy";

type AuthSessionResponse = {
  user?: SessionUser | null;
};

export async function getServerSessionUser() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    const response = await fetch(
      new URL("/auth/session", BACKEND_API_BASE_URL),
      {
        headers: cookieHeader ? { cookie: cookieHeader } : {},
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return null;
    }

    const payload = (await parseBackendPayload(
      response,
    )) as AuthSessionResponse;
    return payload.user ?? null;
  } catch {
    return null;
  }
}
