import { createHmac } from "node:crypto";
import { cookies } from "next/headers";
import { adminToken } from "./env";

export const ADMIN_COOKIE = "vd_admin";
/** Sessão expira sem atividade depois deste tempo. Ações do admin renovam; só recarregar a página não renova. */
export const ADMIN_SESSION_IDLE_MS = 10 * 60 * 1000;

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
  return age >= 0 && age <= ADMIN_SESSION_IDLE_MS;
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

/** Server Actions: renova a sessão a cada ação do admin (janela deslizante de inatividade). */
export async function refreshAdminSession(): Promise<void> {
  const value = createSessionValue();
  if (!value) return;
  const store = await cookies();
  store.set(ADMIN_COOKIE, value, sessionCookieOptions());
}

/** Route Handlers: aceita o header x-admin-token (token) ou o cookie de sessão. */
export function isAdminRequest(req: Request): boolean {
  const header = req.headers.get("x-admin-token");
  if (isValidAdminToken(header)) return true;
  const cookie = req.headers.get("cookie") ?? "";
  const match = cookie.split(";").map((c) => c.trim()).find((c) => c.startsWith(`${ADMIN_COOKIE}=`));
  return isValidSessionValue(match ? decodeURIComponent(match.slice(ADMIN_COOKIE.length + 1)) : null);
}
