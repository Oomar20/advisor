import { NextRequest, NextResponse } from "next/server";

import { BACKEND_API_BASE_URL, parseBackendPayload } from "@/lib/backend-proxy";

export async function GET(request: NextRequest) {
  const backendUrl = new URL("/bookings/available", BACKEND_API_BASE_URL);

  request.nextUrl.searchParams.forEach((value, key) => {
    backendUrl.searchParams.set(key, value);
  });

  try {
    const response = await fetch(backendUrl, {
      cache: "no-store",
    });
    const payload = await parseBackendPayload(response);

    return NextResponse.json(payload, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      {
        message: "تعذر الوصول إلى خادم الحجز.",
      },
      {
        status: 502,
      },
    );
  }
}
