
import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";

const COOKIE_NAME = "mashiach_admin";
const SESSION_DURATION = 8 * 60 * 60;

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET חסר או קצר מדי");
  }

  return secret;
}

function createSignature(payload: string) {
  return createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
}

export function verifyAdminPassword(password: unknown) {
  const expected = process.env.ADMIN_PASSWORD;

  if (
    typeof password !== "string" ||
    !expected ||
    password.length > 200
  ) {
    return false;
  }

  const a = Buffer.from(password);
  const b = Buffer.from(expected);

  return (
    a.length === b.length &&
    timingSafeEqual(a, b)
  );
}

export function createAdminCookie() {
  const payload = Buffer.from(
    JSON.stringify({
      exp: Math.floor(Date.now() / 1000) + SESSION_DURATION,
    })
  ).toString("base64url");

  const token = `${payload}.${createSignature(payload)}`;

  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_DURATION}`;
}

export function clearAdminCookie() {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}

export function isAdminRequest(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";

    const cookie = cookieHeader
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${COOKIE_NAME}=`));

    if (!cookie) return false;

    const token = cookie.slice(COOKIE_NAME.length + 1);
    const parts = token.split(".");

    if (parts.length !== 2) return false;

    const expected = Buffer.from(createSignature(parts[0]));
    const actual = Buffer.from(parts[1]);

    if (
      expected.length !== actual.length ||
      !timingSafeEqual(expected, actual)
    ) {
      return false;
    }

    const payload = JSON.parse(
      Buffer.from(parts[0], "base64url").toString("utf8")
    );

    return (
      Number.isInteger(payload.exp) &&
      payload.exp > Math.floor(Date.now() / 1000)
    );
  } catch {
    return false;
  }
}
