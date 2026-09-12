import type { UserRole } from "../roles";

export type UserDTO = {
  id: string;
  name: string;
  role: UserRole;
  status: string;
  department: string;
  departmentId: string | null;
  email: string | null;
  phone: string | null;
  joinedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type InvitationDTO = {
  valid: boolean;
  message?: string;
  departmentId?: string | null;
  status?: string;
};

const STATUS_TO_ARABIC: Record<string, string> = {
  pending: "بانتظار الاعتماد",
  active: "نشط",
  inactive: "غير نشط",
  suspended: "موقوف",
  ended: "منتهي التطوع",
};

const ARABIC_TO_STATUS: Record<string, string> = {
  "بانتظار الاعتماد": "pending",
  "نشط": "active",
  "غير نشط": "inactive",
  "موقوف": "suspended",
  "منتهي التطوع": "ended",
};

export function statusToArabic(status: string | null | undefined): string {
  if (!status) return "—";
  return STATUS_TO_ARABIC[status] ?? status;
}

export function statusFromArabic(label: string): string {
  return ARABIC_TO_STATUS[label] ?? label;
}

export function formatDateShort(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${date.getFullYear()}/${month}/${day}`;
}

export function formatJoinDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  const day = date.getDate();
  const month = date.toLocaleDateString("ar-EG", { month: "long" });
  const year = date.getFullYear();
  if (Number.isNaN(day)) return "—";
  return `${day} ${month} ${year}`;
}

async function parseJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchUsers(
  department?: string
): Promise<UserDTO[] | null> {
  const params = new URLSearchParams();
  if (department) {
    params.set("department", department);
  }
  const query = params.toString();

  const response = await fetch(`/api/users${query ? `?${query}` : ""}`).catch(
    () => null
  );

  if (!response || !response.ok) {
    return null;
  }

  const data = await parseJson<{ users?: UserDTO[] }>(response);
  return data?.users ?? null;
}

export async function fetchUser(id: string): Promise<UserDTO | null> {
  const response = await fetch(`/api/users/${encodeURIComponent(id)}`).catch(
    () => null
  );

  if (!response || !response.ok) {
    return null;
  }

  const data = await parseJson<{ user?: UserDTO }>(response);
  return data?.user ?? null;
}

export async function verifyInvite(code: string): Promise<InvitationDTO> {
  const response = await fetch("/api/invitations/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  }).catch(() => null);

  if (!response) {
    return { valid: false, message: "تعذر الاتصال بالخادم. حاول مرة أخرى." };
  }

  const data = await parseJson<InvitationDTO>(response);

  if (response.status === 503) {
    return { valid: true, message: "" };
  }

  return data ?? { valid: false, message: "رمز الدعوة غير صالح." };
}

export async function registerUser(payload: {
  code: string;
  firstName: string;
  fatherName: string;
  familyName: string;
  email: string;
  phone: string;
  birthDate: string;
  nationality: string;
  residence: string;
  countryCode?: string;
  skills: string[];
  tools: string[];
  telegramId?: number;
  telegramUsername?: string;
}): Promise<{ demoMode: boolean; id?: string; error?: string }> {
  const response = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => null);

  if (!response) {
    return { demoMode: false, error: "تعذر الاتصال بالخادم. حاول مرة أخرى." };
  }

  if (response.status === 503) {
    return { demoMode: true };
  }

  const data = await parseJson<{ user?: { id: string }; error?: string }>(
    response
  );

  if (!response.ok || !data?.user) {
    return {
      demoMode: false,
      error: data?.error ?? "تعذر إتمام التسجيل. حاول مرة أخرى.",
    };
  }

  return { demoMode: false, id: data.user.id };
}

export async function telegramAuth(
  initData: string
): Promise<{ hasLinkedUser: boolean; userId?: string; error?: string }> {
  const response = await fetch("/api/auth/telegram", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initData }),
  }).catch(() => null);

  if (!response) {
    return { hasLinkedUser: false, error: "تعذر الاتصال بخادم التطبيق." };
  }

  const data = await parseJson<{
    hasLinkedUser?: boolean;
    userId?: string;
    error?: string;
  }>(response);

  if (response.status === 503) {
    return { hasLinkedUser: false };
  }

  if (!response.ok || !data?.hasLinkedUser || !data.userId) {
    return { hasLinkedUser: false, error: data?.error ?? "غير مرتبط" };
  }

  return { hasLinkedUser: true, userId: data.userId };
}