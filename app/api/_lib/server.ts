
import { createHmac, timingSafeEqual } from "node:crypto";

export function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export function normalizePhone(input: unknown): string | null {
  if (typeof input !== "string") return null;

  let value = input.trim().replace(/[()\s.-]/g, "");

  if (value.startsWith("00")) {
    value = `+${value.slice(2)}`;
  }

  if (/^05\d{8}$/.test(value)) {
    value = `+972${value.slice(1)}`;
  } else if (/^9725\d{8}$/.test(value)) {
    value = `+${value}`;
  }

  if (!/^\+[1-9]\d{7,14}$/.test(value)) {
    return null;
  }

  return value;
}

function signingSecret() {
  const secret = process.env.OTP_SIGNING_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("OTP_SIGNING_SECRET חסר או קצר מדי");
  }

  return secret;
}

export function createVerificationToken(phone: string): string {
  const payload = Buffer.from(
    JSON.stringify({
      phone,
      exp: Math.floor(Date.now() / 1000) + 15 * 60,
    })
  ).toString("base64url");

  const signature = createHmac(
    "sha256",
    signingSecret()
  ).update(payload).digest("base64url");

  return `${payload}.${signature}`;
}

export function verifyVerificationToken(
  token: unknown,
  phone: string
): boolean {
  if (typeof token !== "string" || token.length > 2000) {
    return false;
  }

  const parts = token.split(".");

  if (parts.length !== 2) return false;

  try {
    const expected = createHmac(
      "sha256",
      signingSecret()
    ).update(parts[0]).digest();

    const actual = Buffer.from(parts[1], "base64url");

    if (
      actual.length !== expected.length ||
      !timingSafeEqual(actual, expected)
    ) {
      return false;
    }

    const payload = JSON.parse(
      Buffer.from(parts[0], "base64url").toString("utf8")
    );

    return (
      payload.phone === phone &&
      Number.isInteger(payload.exp) &&
      payload.exp > Math.floor(Date.now() / 1000)
    );
  } catch {
    return false;
  }
}

export function getTwilioConfig() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

  if (!accountSid || !authToken || !verifyServiceSid) {
    throw new Error("פרטי Twilio חסרים בהגדרות הסביבה");
  }

  return {
    accountSid,
    authToken,
    verifyServiceSid,
  };
}

export function twilioAuth(
  authToken: string,
  accountSid: string
) {
  return `Basic ${Buffer.from(
    `${accountSid}:${authToken}`
  ).toString("base64")}`;
}

export async function readTwilioError(response: Response) {
  const body = await response.json().catch(() => ({}));

  return typeof body.message === "string"
    ? body.message
    : "שירות אימות ה-SMS החזיר שגיאה";
}
