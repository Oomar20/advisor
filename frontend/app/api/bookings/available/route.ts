import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL ?? "http://localhost:3002";

export async function GET(request: NextRequest) {
  const backendUrl = new URL("/bookings/available", BACKEND_API_BASE_URL);

  request.nextUrl.searchParams.forEach((value, key) => {
    backendUrl.searchParams.set(key, value);
  });

  try {
    const response = await fetch(backendUrl, {
      cache: "no-store",
    });
    const payload = await response.json();

    return NextResponse.json(payload, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      {
        message: "Unable to reach the booking backend.",
      },
      {
        status: 502,
      },
    );
  }
}
