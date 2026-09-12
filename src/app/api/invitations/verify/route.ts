import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../../lib/supabase/server";

export async function POST(request: Request) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      {
        valid: true,
        message: "demo",
      },
      { status: 503 }
    );
  }

  let body: { code?: string } = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const code = (body.code ?? "").trim().toUpperCase();
  if (!code) {
    return NextResponse.json({
      valid: false,
      message: "فضلاً أدخل رمز الدعوة.",
    });
  }

  const { data, error } = await supabase
    .from("invitations")
    .select("code, status, department_id, expires_at")
    .eq("code", code)
    .maybeSingle();

  if (error) {
    return NextResponse.json({
      valid: false,
      message: "تعذر التحقق من الرمز. حاول مرة أخرى.",
    });
  }

  if (!data) {
    return NextResponse.json({
      valid: false,
      message: "رمز الدعوة غير صالح.",
    });
  }

  const status = (data.status ?? "").toLowerCase();
  if (status !== "active" && status !== "unused") {
    return NextResponse.json({
      valid: false,
      message: "رمز الدعوة مستخدم مسبقًا أو غير متاح.",
    });
  }

  if (data.expires_at && new Date(data.expires_at).getTime() < Date.now()) {
    return NextResponse.json({
      valid: false,
      message: "انتهت صلاحية رمز الدعوة.",
    });
  }

  return NextResponse.json({
    valid: true,
    message: "",
    departmentId: data.department_id ?? null,
    status: data.status,
  });
}