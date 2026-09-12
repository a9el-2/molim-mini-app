import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const internalToken = process.env.INTERNAL_API_TOKEN;

  if (
    !internalToken ||
    request.headers.get("authorization") !==
      `Bearer ${internalToken}`
  ) {
    return NextResponse.json(
      { error: "غير مصرح بالوصول" },
      { status: 401 }
    );
  }

  return NextResponse.json({ ok: true });
}