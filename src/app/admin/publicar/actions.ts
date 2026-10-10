"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { adminTotpSecret } from "@/lib/env";
import { verifyTotp } from "@/lib/totp";
import { publishVersion } from "@/lib/live-config-server";
import { buildPublishPlan } from "@/lib/publish-plan";

/** Erros seguidos de código bloqueiam a publicação por 10 minutos. */
const failures = new Map<string, { count: number; until: number }>();
let lastStep = -1;

/**
 * Publica o rascunho (ou volta para uma versão antiga). Exige nome, motivo, "Estou ciente", a frase exata
 * e o código do Google Authenticator. Cria uma nova versão imutável no histórico.
 */
export async function publishAction(formData: FormData) {
  if (!(await isAdminSession())) redirect("/admin/login");
  const rollback = Number(formData.get("rollback") ?? 0) || null;
  const back = (erro: string) => redirect(`/admin/publicar?${rollback ? `rollback=${rollback}&` : ""}erro=${erro}`);

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const f = failures.get(ip);
  if (f && f.count >= 5 && now < f.until) back("bloqueado");

  const plan = await buildPublishPlan(rollback);
  if (!plan || !plan.changes.length) back("sem-mudancas");
  if (plan!.errors.length) back("invalido");

  const author = String(formData.get("author") ?? "").trim().slice(0, 60);
  const reason = String(formData.get("reason") ?? "").trim().slice(0, 300);
  if (author.length < 2) back("nome");
  if (reason.length < 3) back("motivo");
  if (formData.get("aware") !== "on") back("ciente");
  if (String(formData.get("phrase") ?? "").trim().toLowerCase() !== plan!.phrase.toLowerCase()) back("frase");

  const secret = adminTotpSecret();
  if (secret) {
    const step = verifyTotp(secret, String(formData.get("code") ?? ""), now);
    if (step === null || step <= lastStep) {
      failures.set(ip, { count: (f && now < f.until ? f.count : 0) + 1, until: now + 10 * 60 * 1000 });
      back("codigo");
    }
    lastStep = step!;
  }
  failures.delete(ip);

  const id = await publishVersion({
    cfg: plan!.target, author, reason, sections: plan!.sections, changes: plan!.changes, impact: plan!.impact!, rollbackOf: plan!.rollbackOf,
  });
  revalidatePath("/", "layout");
  redirect(`/admin/historico?publicado=${id}`);
}
