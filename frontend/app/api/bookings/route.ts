import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL ?? "http://localhost:3002";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetch(new URL("/bookings", BACKEND_API_BASE_URL), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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
