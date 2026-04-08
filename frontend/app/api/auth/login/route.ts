import { NextRequest, NextResponse } from "next/server";

import {
  BACKEND_API_BASE_URL,
  parseBackendPayload,
  withForwardedCookies,
} from "@/lib/backend-proxy";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetch(new URL("/auth/login", BACKEND_API_BASE_URL), {
      method: "POST",
      headers: withForwardedCookies(request, {
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const payload = await parseBackendPayload(response);
    const nextResponse = NextResponse.json(payload, {
      status: response.status,
    });
    const setCookie = response.headers.get("set-cookie");

    if (setCookie) {
      nextResponse.headers.set("set-cookie", setCookie);
    }

    return nextResponse;
  } catch {
    return NextResponse.json(
      {
        message: "تعذر الوصول إلى خادم تسجيل الدخول.",
      },
      {
        status: 502,
      },
    );
  }
}
