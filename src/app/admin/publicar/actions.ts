"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { adminTotpSecret } from "@/lib/env";
import { verifyTotp } from "@/lib/totp";
import { closeRequest, createRequest, getPublishedConfig, getRequest, getVersion, getWorkingConfig, publishVersion, reopenAsDraft } from "@/lib/live-config-server";
import { buildPublishPlan, numbersFor } from "@/lib/publish-plan";
import { applyScope, diffConfig, type LiveConfig, type Scope } from "@/lib/live-config";
import { discardDraft, saveDraft } from "@/lib/live-config-server";

const failures = new Map<string, { count: number; until: number }>();
let lastStep = -1;
const txt = (f: FormData, k: string, max: number) => String(f.get(k) ?? "").trim().slice(0, max);

/** Envia o rascunho para aprovação (como abrir um pull request). */
export async function submitDraftAction(formData: FormData) {
  if (!(await isAdminSession())) redirect("/admin/login");
  const author = txt(formData, "author", 60), note = txt(formData, "note", 600);
  if (author.length < 2 || note.length < 3) redirect("/admin/publicar?erro=envio");
  const { cfg, published, hasDraft } = await getWorkingConfig();
  const changes = diffConfig(published.cfg, cfg, numbersFor(published.cfg, cfg));
  if (!hasDraft || !changes.length) redirect("/admin/publicar?erro=sem-mudancas");
  const id = await createRequest({ author, note, cfg, baseVersion: published.version, changes, fromDraft: true });
  revalidatePath("/admin", "layout");
  redirect(`/admin/publicar/${id}?enviado=1`);
}

/** Pede a volta para uma versão antiga (vira um pedido para aprovação). */
export async function requestRollbackAction(formData: FormData) {
  if (!(await isAdminSession())) redirect("/admin/login");
  const v = Number(formData.get("version"));
  const author = txt(formData, "author", 60), note = txt(formData, "note", 600);
  const old = await getVersion(v);
  if (!old || author.length < 2 || note.length < 3) redirect(`/admin/publicar/voltar/${v}?erro=1`);
  const pub = await getPublishedConfig(true);
  const id = await createRequest({ author, note, cfg: old!.cfg, baseVersion: pub.version, changes: diffConfig(pub.cfg, old!.cfg, numbersFor(pub.cfg, old!.cfg)), rollbackOf: v, fromDraft: false });
  revalidatePath("/admin", "layout");
  redirect(`/admin/publicar/${id}?enviado=1`);
}

/** Aprova e publica um pedido: nome de quem aprova, motivo, "Estou ciente", frase e código. */
export async function approveAction(formData: FormData) {
  if (!(await isAdminSession())) redirect("/admin/login");
  const id = Number(formData.get("request"));
  const back = (erro: string) => redirect(`/admin/publicar/${id}?erro=${erro}`);
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const f = failures.get(ip);
  if (f && f.count >= 5 && now < f.until) back("bloqueado");

  const req = await getRequest(id);
  if (!req || req.row.status !== "aberto") back("fechado");
  const pub = await getPublishedConfig(true);
  const target = requestTarget(req!.cfg, req!.row.scope as Scope | null, pub.cfg);
  if (!req!.row.scope && req!.row.baseVersion !== pub.version) back("desatualizado");
  const plan = await buildPublishPlan(target, req!.row.rollbackOf);
  if (!plan.changes.length) back("sem-mudancas");
  if (plan.errors.length) back("invalido");

  const approver = txt(formData, "author", 60);
  const reason = txt(formData, "reason", 300);
  if (approver.length < 2) back("nome");
  if (reason.length < 3) back("motivo");
  if (formData.get("aware") !== "on") back("ciente");
  if (txt(formData, "phrase", 200).toLowerCase() !== plan.phrase.toLowerCase()) back("frase");
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

  const v = await publishVersion({
    cfg: plan.target, author: req!.row.author, reason, sections: plan.sections, changes: plan.changes, impact: plan.impact!,
    rollbackOf: req!.row.rollbackOf, approvedBy: approver, requestId: id, keepDraft: true,
  });
  revalidatePath("/", "layout");
  redirect(`/admin/historico?publicado=${v}`);
}

/** Recusa um pedido, com comentário. As mudanças podem voltar para o rascunho para corrigir. */
export async function rejectAction(formData: FormData) {
  if (!(await isAdminSession())) redirect("/admin/login");
  const id = Number(formData.get("request"));
  const by = txt(formData, "author", 60), note = txt(formData, "note", 600);
  if (by.length < 2) redirect(`/admin/publicar/${id}?erro=nome-recusa`);
  if (!formData.get("cancel") && note.length < 3) redirect(`/admin/publicar/${id}?erro=motivo-recusa`);
  await closeRequest(id, formData.get("cancel") ? "cancelado" : "recusado", by, note);
  revalidatePath("/admin", "layout");
  redirect(`/admin/publicar?fechado=${id}`);
}

/** Leva as mudanças de um pedido fechado de volta ao rascunho. */
export async function reopenAction(formData: FormData) {
  if (!(await isAdminSession())) redirect("/admin/login");
  await reopenAsDraft(Number(formData.get("request")));
  revalidatePath("/admin", "layout");
  redirect("/admin/publicar?reaberto=1");
}

/** Alvo de um pedido: de um item só, ele é aplicado sobre a versão no ar agora (não fica desatualizado). */
function requestTarget(snapshot: LiveConfig, scope: Scope | null, live: LiveConfig): LiveConfig {
  return scope ? applyScope(live, snapshot, scope) : snapshot;
}

/** "Enviar para aprovação" de um item só: vira um pedido com aquela mudança; ela sai do rascunho. */
export async function submitItemAction(scope: Scope, author: string, note: string): Promise<{ id?: number; error?: string }> {
  if (!(await isAdminSession())) return { error: "Sessão expirada. Entre de novo." };
  author = author.trim().slice(0, 60); note = note.trim().slice(0, 600);
  if (author.length < 2 || note.length < 3) return { error: "Preencha seu nome e a descrição." };
  const { cfg, published, hasDraft } = await getWorkingConfig();
  if (!hasDraft) return { error: "Nada para enviar: salve a mudança primeiro." };
  const target = applyScope(published.cfg, cfg, scope);
  const changes = diffConfig(published.cfg, target, numbersFor(published.cfg, target));
  if (!changes.length) return { error: "Este item está igual ao que está no ar." };
  const id = await createRequest({ author, note, cfg: target, baseVersion: published.version, changes, scope, fromDraft: false });
  const rest = applyScope(cfg, published.cfg, scope);
  if (diffConfig(published.cfg, rest).length) await saveDraft(rest, published.version); else await discardDraft();
  revalidatePath("/admin", "layout");
  return { id };
}

/** Desfaz um ajuste ainda não enviado: aquele item volta a ser igual ao que está no ar. */
export async function discardItemAction(scope: Scope): Promise<void> {
  if (!(await isAdminSession())) return;
  const { cfg, published, hasDraft } = await getWorkingConfig();
  if (!hasDraft) return;
  const rest = applyScope(cfg, published.cfg, scope);
  if (diffConfig(published.cfg, rest).length) await saveDraft(rest, published.version); else await discardDraft();
  revalidatePath("/admin", "layout");
}
