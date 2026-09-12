import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../../lib/supabase/server";

function pickName(row: Record<string, unknown>): string {
  if (typeof row.name === "string" && row.name) return row.name;
  if (typeof row.full_name === "string" && row.full_name) return row.full_name;
  const first =
    typeof row.first_name === "string" ? (row.first_name as string) : "";
  const last =
    typeof row.last_name === "string" ? (row.last_name as string) : "";
  if (first || last) return [first, last].filter(Boolean).join(" ");
  return String(row.id ?? "");
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { demo: true },
      { status: 503 }
    );
  }

  const { id } = await params;

  const { data: row, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !row) {
    return NextResponse.json(
      { error: "تعذر جلب المستخدم." },
      { status: 404 }
    );
  }

  const record = row as Record<string, unknown>;
  const departmentId = record.department_id
    ? String(record.department_id)
    : null;

  let department = "غير محدد";
  if (departmentId) {
    const { data: dept } = await supabase
      .from("departments")
      .select("name")
      .eq("id", departmentId)
      .maybeSingle();
    department = dept?.name ? String(dept.name) : "غير محدد";
  }

  return NextResponse.json({
    user: {
      id: String(record.id ?? ""),
      name: pickName(record),
      role: String(record.role ?? "VOLUNTEER"),
      status: String(record.status ?? "pending"),
      department,
      departmentId,
      email: typeof record.email === "string" ? record.email : null,
      phone: typeof record.phone === "string" ? record.phone : null,
      joinedAt: typeof record.joined_at === "string" ? record.joined_at : null,
      createdAt: typeof record.created_at === "string" ? record.created_at : null,
      updatedAt: typeof record.updated_at === "string" ? record.updated_at : null,
    },
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { demo: true },
      { status: 503 }
    );
  }

  const { id } = await params;

  let body: { field?: string; value?: string } = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const { field, value } = body;

  if (
    (field !== "status" && field !== "role") ||
    typeof value !== "string" ||
    !value.trim()
  ) {
    return NextResponse.json(
      { error: "بيانات غير صالحة." },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("users")
    .update({ [field]: value })
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: "تعذر تحديث المستخدم." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}