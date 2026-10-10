"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { checkPublishCode } from "@/lib/admin-approval";
import { createRequest, discardDraft, getWorkingConfig, publishVersion, saveDraft } from "@/lib/live-config-server";
import { buildPublishPlan, numbersFor } from "@/lib/publish-plan";
import { applyScope, diffConfig, draftItems, scopeId, type Scope } from "@/lib/live-config";

const txt = (f: FormData, k: string, max: number) => String(f.get(k) ?? "").trim().slice(0, max);

/** Itens marcados no formulário que ainda estão no rascunho (ignora o que já não existe). */
async function selected(formData: FormData) {
  const w = await getWorkingConfig();
  const all = w.hasDraft ? draftItems(w.published.cfg, w.cfg) : [];
  let wanted: string[] = [];
  try { wanted = (JSON.parse(String(formData.get("items") ?? "[]")) as Scope[]).map(scopeId); } catch {}
  const items = all.filter((s) => wanted.includes(scopeId(s)));
  const scope: Scope = { kind: "many", items };
  return { w, items, scope, target: applyScope(w.published.cfg, w.cfg, scope) };
}

/** Depois de publicar ou enviar: o rascunho fica só com o que não foi marcado. */
async function keepRest(removed: Scope) {
  const w = await getWorkingConfig();
  if (!w.hasDraft) return;
  const rest = applyScope(w.cfg, w.published.cfg, removed);
  if (diffConfig(w.published.cfg, rest).length) await saveDraft(rest, w.published.version); else await discardDraft();
}

/** Publica direto as mudanças marcadas: motivo e código do Google Authenticator. Vira uma versão no Histórico. */
export async function publishSelectedAction(formData: FormData) {
  if (!(await isAdminSession())) redirect("/admin/login");
  const back = (erro: string) => redirect(`/admin/rascunho?erro=${erro}`);
  const author = txt(formData, "author", 60), reason = txt(formData, "reason", 300);
  const { items, target } = await selected(formData);
  if (!items.length) back("nada");
  if (author.length < 2) back("nome");
  if (reason.length < 3) back("motivo");
  const plan = await buildPublishPlan(target, null);
  if (!plan.changes.length) back("nada");
  if (plan.errors.length) back("invalido");
  const code = await checkPublishCode(formData.get("code"));
  if (code !== "ok") back(code);
  const v = await publishVersion({ cfg: plan.target, author, reason, sections: plan.sections, changes: plan.changes, impact: plan.impact!, approvedBy: author, keepDraft: true });
  // o rascunho vem por cima da versão nova; o que foi publicado some dele sozinho
  const w = await getWorkingConfig();
  if (w.hasDraft) { if (diffConfig(w.published.cfg, w.cfg).length) await saveDraft(w.cfg, w.published.version); else await discardDraft(); }
  revalidatePath("/", "layout");
  redirect(`/admin/historico?publicado=${v}`);
}

/** Envia as mudanças marcadas para outra pessoa aprovar (vira um pedido na aba Pedidos). */
export async function sendSelectedAction(formData: FormData) {
  if (!(await isAdminSession())) redirect("/admin/login");
  const author = txt(formData, "author", 60), note = txt(formData, "reason", 600);
  if (author.length < 2) redirect("/admin/rascunho?erro=nome");
  if (note.length < 3) redirect("/admin/rascunho?erro=motivo");
  const { w, items, scope, target } = await selected(formData);
  if (!items.length) redirect("/admin/rascunho?erro=nada");
  const changes = diffConfig(w.published.cfg, target, numbersFor(w.published.cfg, target));
  const id = await createRequest({ author, note, cfg: target, baseVersion: w.published.version, changes, scope, fromDraft: false });
  await keepRest(scope);
  revalidatePath("/admin", "layout");
  redirect(`/admin/publicar/${id}?enviado=1`);
}
