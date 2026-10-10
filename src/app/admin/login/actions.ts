"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, createSessionValue, isValidAdminToken, sessionCookieOptions } from "@/lib/admin-auth";
import { adminTotpSecret } from "@/lib/env";
import { verifyTotp } from "@/lib/totp";

/** Tentativas erradas por endereço: 5 erros bloqueiam o login por 10 minutos. */
const MAX_FAILURES = 5;
const BLOCK_MS = 10 * 60 * 1000;
const failures = new Map<string, { count: number; until: number }>();
/** Passo do último código aceito: o mesmo código não entra duas vezes. */
let lastAcceptedStep = -1;

export async function loginAction(formData: FormData) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const f = failures.get(ip);
  if (f && f.count >= MAX_FAILURES && now < f.until) redirect("/admin/login?erro=bloqueado");

  const secret = adminTotpSecret();
  let ok = false;
  if (secret) {
    const step = verifyTotp(secret, String(formData.get("code") ?? ""), now);
    ok = step !== null && step > lastAcceptedStep;
    if (ok) lastAcceptedStep = step!;
  } else {
    // Sem autenticador configurado (ex.: ambiente local), vale o token antigo.
    ok = isValidAdminToken(String(formData.get("token") ?? ""));
  }

  if (!ok) {
    const next = { count: (f && now < f.until ? f.count : 0) + 1, until: now + BLOCK_MS };
    failures.set(ip, next);
    redirect("/admin/login?erro=1");
  }
  failures.delete(ip);
  const value = createSessionValue(now);
  if (!value) redirect("/admin/login?erro=1");
  const store = await cookies();
  store.set(ADMIN_COOKIE, value, sessionCookieOptions());
  redirect("/admin?entrou=1");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/");
}
