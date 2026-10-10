import { headers } from "next/headers";
import { adminTotpSecret } from "@/lib/env";
import { verifyTotp } from "@/lib/totp";

/**
 * Código do Google Authenticator para publicar (aba Rascunho e aprovação de pedidos).
 * Cada código vale uma vez; 5 erros seguidos do mesmo endereço bloqueiam por 10 minutos.
 */
const failures = new Map<string, { count: number; until: number }>();
let lastStep = -1;

export type CodeCheck = "ok" | "bloqueado" | "codigo";

export async function checkPublishCode(code: unknown): Promise<CodeCheck> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const f = failures.get(ip);
  if (f && f.count >= 5 && now < f.until) return "bloqueado";
  const secret = adminTotpSecret();
  if (!secret) return "ok";
  const step = verifyTotp(secret, String(code ?? ""), now);
  if (step === null || step <= lastStep) {
    failures.set(ip, { count: (f && now < f.until ? f.count : 0) + 1, until: now + 10 * 60 * 1000 });
    return "codigo";
  }
  lastStep = step;
  failures.delete(ip);
  return "ok";
}
