import { createHmac } from "node:crypto";
import { cookies } from "next/headers";
import { adminToken } from "./env";

export const ADMIN_COOKIE = "vd_admin";
/** A sessão termina 30 minutos depois do login, aconteça o que acontecer; depois disso o código é pedido de novo. */
export const ADMIN_SESSION_MAX_MS = 30 * 60 * 1000;

/** Comparação em tempo constante para evitar vazamento por timing. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function isValidAdminToken(candidate: string | null | undefined): boolean {
  const expected = adminToken();
  if (!expected || !candidate) return false;
  return safeEqual(candidate, expected);
}

// ---------------------------------------------------------------------------
// Sessão: o cookie NUNCA carrega o token. Carrega "<emitida-em>.<hmac>", assinado com o
// token, sem Max-Age (morre ao fechar o navegador) e inválido após ADMIN_SESSION_IDLE_MS.
// ---------------------------------------------------------------------------

function sign(issuedAt: string, secret: string): string {
  return createHmac("sha256", secret).update(`vd-admin-session:${issuedAt}`).digest("hex");
}

export function createSessionValue(now = Date.now()): string | null {
  const secret = adminToken();
  if (!secret) return null;
  const issuedAt = String(now);
  return `${issuedAt}.${sign(issuedAt, secret)}`;
}

export function isValidSessionValue(value: string | null | undefined, now = Date.now()): boolean {
  const secret = adminToken();
  if (!secret || !value) return false;
  const dot = value.indexOf(".");
  if (dot <= 0) return false;
  const issuedAt = value.slice(0, dot);
  const mac = value.slice(dot + 1);
  if (!/^\d{10,16}$/.test(issuedAt) || !safeEqual(mac, sign(issuedAt, secret))) return false;
  const age = now - Number(issuedAt);
  return age >= 0 && age <= ADMIN_SESSION_MAX_MS;
}

export function sessionCookieOptions() {
  // Sem maxAge/expires: cookie de sessão, apagado quando o navegador fecha.
  return { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/" };
}

/** Server Components / Server Actions. */
export async function isAdminSession(): Promise<boolean> {
  const store = await cookies();
  return isValidSessionValue(store.get(ADMIN_COOKIE)?.value);
}


/** Quando a sessão atual termina (ms desde 1970), para o relógio do admin. null sem sessão válida. */
export async function adminSessionExpiresAt(): Promise<number | null> {
  const store = await cookies();
  const value = store.get(ADMIN_COOKIE)?.value;
  if (!isValidSessionValue(value)) return null;
  return Number(value!.slice(0, value!.indexOf("."))) + ADMIN_SESSION_MAX_MS;
}

/** Route Handlers: só o cookie de sessão (quem entrou com o código). */
export function isAdminRequest(req: Request): boolean {
  const cookie = req.headers.get("cookie") ?? "";
  const match = cookie.split(";").map((c) => c.trim()).find((c) => c.startsWith(`${ADMIN_COOKIE}=`));
  return isValidSessionValue(match ? decodeURIComponent(match.slice(ADMIN_COOKIE.length + 1)) : null);
}
