"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { checkPublishCode } from "@/lib/admin-approval";
import { closeRequest, createRequest, getPublishedConfig, getRequest, getVersion, getWorkingConfig, publishVersion, reopenAsDraft } from "@/lib/live-config-server";
import { buildPublishPlan, numbersFor } from "@/lib/publish-plan";
import { applyScope, diffConfig, type LiveConfig, type Scope } from "@/lib/live-config";
import { discardDraft, saveDraft } from "@/lib/live-config-server";

const txt = (f: FormData, k: string, max: number) => String(f.get(k) ?? "").trim().slice(0, max);

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

/** Aprova e publica um pedido: nome de quem aprova, motivo e código. */
export async function approveAction(formData: FormData) {
  if (!(await isAdminSession())) redirect("/admin/login");
  const id = Number(formData.get("request"));
  const back = (erro: string) => redirect(`/admin/publicar/${id}?erro=${erro}`);

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
  const code = await checkPublishCode(formData.get("code"));
  if (code !== "ok") back(code);

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

/** Desfaz um ajuste ainda não enviado: aquele item volta a ser igual ao que está no ar. */
export async function discardItemAction(scope: Scope): Promise<void> {
  if (!(await isAdminSession())) return;
  const { cfg, published, hasDraft } = await getWorkingConfig();
  if (!hasDraft) return;
  const rest = applyScope(cfg, published.cfg, scope);
  if (diffConfig(published.cfg, rest).length) await saveDraft(rest, published.version); else await discardDraft();
  revalidatePath("/admin", "layout");
}
