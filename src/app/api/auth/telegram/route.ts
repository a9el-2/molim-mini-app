import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../../lib/supabase/server";
import {
  validateTelegramInitData,
  isTelegramInitDataFresh,
} from "../../../lib/telegram";

export async function POST(request: NextRequest) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return NextResponse.json(
      { error: "TELEGRAM_BOT_TOKEN غير معرّف على الخادم" },
      { status: 500 }
    );
  }

  let body;
  try {
    body = (await request.json()) as { initData?: string };
  } catch {
    return NextResponse.json(
      { error: "الطلب غير صالح" },
      { status: 400 }
    );
  }

  if (!body.initData) {
    return NextResponse.json(
      { error: "مطلوب initData" },
      { status: 400 }
    );
  }

  const validation = validateTelegramInitData(body.initData, botToken);
  console.log("[telegram-auth] deployed build marker: DUAL-v3");
  console.log(
    "[telegram-auth] initData FULL:",
    body.initData
  );
  console.log(
    "[telegram-auth] hash field:",
    body.initData.split("&").find((p) => p.startsWith("hash=")) ?? "MISSING"
  );
  if (!validation.ok) {
    const crypto = await import("crypto");
    const secret = crypto
      .createHmac("sha256", Buffer.from("WebAppData"))
      .update(Buffer.from(botToken))
      .digest();
    const params = new URLSearchParams(body.initData);
    const decoded = Array.from(params.entries())
      .filter(([k]) => k !== "hash")
      .map(([k, v]) => `${k}=${v}`)
      .sort()
      .join("\n");
    const rawSorted = body.initData
      .split("&")
      .filter((p) => p && !p.startsWith("hash="))
      .sort()
      .join("\n");
    const hDecoded = crypto.createHmac("sha256", secret).update(decoded).digest("hex");
    const hRaw = crypto.createHmac("sha256", secret).update(rawSorted).digest("hex");
    const given = params.get("hash") ?? "none";
    console.log("[telegram-auth] decoded-hash:", hDecoded);
    console.log("[telegram-auth] raw-hash    :", hRaw);
    console.log("[telegram-auth] given-hash   :", given);
    console.log("[telegram-auth] decoded-ok   :", hDecoded === given);
    console.log("[telegram-auth] raw-ok       :", hRaw === given);
  }
  console.log("[telegram-auth] validation ok:", validation.ok, JSON.stringify(validation.ok ? validation.user : validation));

  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 401 });
  }

  if (!isTelegramInitDataFresh(validation.authDate)) {
    console.log("[telegram-auth] stale auth_date:", validation.authDate);
    return NextResponse.json(
      { error: "انتهت صلاحية الجلسة، أعد فتح التطبيق" },
      { status: 401 }
    );
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase غير مكوّن" },
      { status: 503 }
    );
  }

  const { data: sample } = await supabase
    .from("users")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (sample && "telegram_id" in sample) {
    console.log(
      "[telegram-auth] looking up telegram_id:",
      validation.user.telegramId
    );

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("telegram_id", validation.user.telegramId)
      .maybeSingle();

    console.log(
      "[telegram-auth] user lookup error:",
      userError ? JSON.stringify(userError) : "none",
      "user:",
      user ? JSON.stringify({ id: user.id, role: user.role, status: user.status }) : "null"
    );

    if (!user) {
      return NextResponse.json(
        { error: "حساب Telegram غير مرتبط بأي عضو", hasLinkedUser: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      telegram: validation.user,
      hasLinkedUser: true,
      userId: user.id,
    });
  }

  return NextResponse.json({
    telegram: validation.user,
    hasLinkedUser: false,
  });
}