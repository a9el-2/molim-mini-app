import crypto from "crypto";

export type TelegramUser = {
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
};

export type TelegramAuthResult =
  | { ok: true; user: TelegramUser; authDate: string }
  | { ok: false; error: string };

function hmacSha256(buffer: Buffer, key: Buffer): Buffer {
  return crypto.createHmac("sha256", key).update(buffer).digest();
}

function hexSha256(data: string, key: Buffer): string {
  return crypto.createHmac("sha256", key).update(data).digest("hex");
}

export function validateTelegramInitData(
  initData: string,
  botToken: string
): TelegramAuthResult {
  const params = new URLSearchParams(initData);

  const hash = params.get("hash");
  if (!hash) {
    return { ok: false, error: "بيانات Telegram تفتقد hash" };
  }

  const authDate = params.get("auth_date");
  if (!authDate) {
    return { ok: false, error: "بيانات Telegram تفتقد auth_date" };
  }

  const dataCheckPairs = Array.from(params.entries())
    .filter(([key]) => key !== "hash")
    .map(([key, value]) => `${key}=${value}`)
    .sort();

  const dataCheckString = dataCheckPairs.join("\n");

  const secretKey = hmacSha256(
    Buffer.from("WebAppData"),
    Buffer.from(botToken)
  );

  const calculatedHash = hexSha256(dataCheckString, secretKey);

  if (calculatedHash !== hash) {
    return { ok: false, error: "تعذر التحقق من بيانات Telegram" };
  }

  const rawUser = params.get("user");
  if (!rawUser) {
    return { ok: false, error: "بيانات Telegram لا تحوي المستخدم" };
  }

  let parsedUser: { id: number; username?: string; first_name?: string; last_name?: string };
  try {
    parsedUser = JSON.parse(rawUser) as typeof parsedUser;
  } catch {
    return { ok: false, error: "بيانات Telegram غير صالحة" };
  }

  if (typeof parsedUser.id !== "number") {
    return { ok: false, error: "معرّف Telegram غير صالح" };
  }

  return {
    ok: true,
    user: {
      telegramId: parsedUser.id,
      username: parsedUser.username,
      firstName: parsedUser.first_name,
      lastName: parsedUser.last_name,
    },
    authDate,
  };
}

export function isTelegramInitDataFresh(authDate: string, maxAgeSec = 86400): boolean {
  const authSeconds = Number(authDate);
  if (!Number.isFinite(authSeconds)) return false;
  const nowSeconds = Math.floor(Date.now() / 1000);
  return nowSeconds - authSeconds <= maxAgeSec;
}