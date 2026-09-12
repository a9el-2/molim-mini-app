import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../lib/supabase/server";

function generateMolimId(maxExisting: number | null): string {
  const next = (maxExisting ?? 0) + 1;
  return `MOL-${String(next).padStart(5, "0")}`;
}

export async function POST(request: Request) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "demo" },
      { status: 503 }
    );
  }

  let body: {
    code?: string;
    firstName?: string;
    fatherName?: string;
    familyName?: string;
    email?: string;
    phone?: string;
    birthDate?: string;
    nationality?: string;
    residence?: string;
    countryCode?: string;
    skills?: string[];
    tools?: string[];
    telegramId?: number;
    telegramUsername?: string;
  } = {};

  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const code = (body.code ?? "").trim().toUpperCase();
  const firstName = (body.firstName ?? "").trim();
  const fatherName = (body.fatherName ?? "").trim();
  const familyName = (body.familyName ?? "").trim();

  if (!code || !firstName) {
    return NextResponse.json(
      { error: "البيانات غير مكتملة." },
      { status: 400 }
    );
  }

  const { data: invite } = await supabase
    .from("invitations")
    .select("code, status, department_id")
    .eq("code", code)
    .maybeSingle();

  if (!invite) {
    return NextResponse.json(
      { error: "رمز الدعوة غير صالح." },
      { status: 400 }
    );
  }

  const inviteStatus = (invite.status ?? "").toLowerCase();

  if (inviteStatus !== "active" && inviteStatus !== "unused") {
    return NextResponse.json(
      { error: "رمز الدعوة مستخدم مسبقًا أو غير متاح." },
      { status: 400 }
    );
  }

  const fullName = [firstName, fatherName, familyName]
    .filter(Boolean)
    .join(" ");

  const { data: sample } = await supabase
    .from("users")
    .select("*")
    .limit(1)
    .single();

  const sampleKeys = sample ? Object.keys(sample) : [];

  const nameKey = sampleKeys.includes("name")
    ? "name"
    : sampleKeys.includes("full_name")
      ? "full_name"
      : null;

  const hasSeparateNames = sampleKeys.includes("first_name");

  const joinKey = sampleKeys.includes("joined_at")
    ? "joined_at"
    : sampleKeys.includes("created_at")
      ? "created_at"
      : null;

  const { data: existingIds } = await supabase
    .from("users")
    .select("id");

  let maxNumeric: number | null = null;

  for (const row of existingIds ?? []) {
    const match = /^MOL-(\d+)$/.exec(String(row.id ?? ""));
    if (match) {
      const numeric = Number(match[1]);
      if (maxNumeric === null || numeric > maxNumeric) {
        maxNumeric = numeric;
      }
    }
  }

  const id = generateMolimId(maxNumeric);

  const insertPayload: Record<string, unknown> = {
    role: "VOLUNTEER",
    status: "pending",
    email: body.email?.trim() || null,
    phone: body.phone?.trim() || null,
    nationality: body.nationality?.trim() || null,
    residence: body.residence?.trim() || null,
    birth_date: body.birthDate || null,
    skills: body.skills && body.skills.length ? body.skills : null,
    tools: body.tools && body.tools.length ? body.tools : null,
  };

  if (body.countryCode) {
    insertPayload.country_code = body.countryCode;
  }

  if (body.telegramId) {
    insertPayload.telegram_id = body.telegramId;
  }

  if (body.telegramUsername) {
    insertPayload.telegram_username = body.telegramUsername;
  }

  if (invite.department_id) {
    insertPayload.department_id = invite.department_id;
  }

  if (hasSeparateNames) {
    insertPayload.first_name = firstName;
    insertPayload.father_name = fatherName || null;
    insertPayload.last_name = familyName || null;
  } else if (nameKey) {
    insertPayload[nameKey] = fullName;
  }

  if (joinKey) {
    insertPayload[joinKey] = new Date().toISOString();
  }

  const { error: insertError } = await supabase
    .from("users")
    .insert({ id, ...insertPayload })
    .select("id")
    .maybeSingle();

  if (insertError) {
    return NextResponse.json(
      { error: "تعذر إنشاء الحساب. تأكد من صحة البيانات." },
      { status: 500 }
    );
  }

  await supabase
    .from("invitations")
    .update({ status: "used" })
    .eq("code", code);

  return NextResponse.json({ user: { id } });
}