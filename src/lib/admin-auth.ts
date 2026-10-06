import { cookies } from "next/headers";
import { adminToken } from "./env";

export const ADMIN_COOKIE = "vd_admin";

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

/** Server Components / Server Actions. */
export async function isAdminSession(): Promise<boolean> {
  const store = await cookies();
  return isValidAdminToken(store.get(ADMIN_COOKIE)?.value);
}

/** Route Handlers: aceita cookie ou header x-admin-token. */
export function isAdminRequest(req: Request): boolean {
  const header = req.headers.get("x-admin-token");
  if (isValidAdminToken(header)) return true;
  const cookie = req.headers.get("cookie") ?? "";
  const match = cookie.split(";").map((c) => c.trim()).find((c) => c.startsWith(`${ADMIN_COOKIE}=`));
  return isValidAdminToken(match ? decodeURIComponent(match.slice(ADMIN_COOKIE.length + 1)) : null);
}
