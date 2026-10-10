"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";

import { SUGGESTION_SECTIONS } from "./sections";

/** Registra uma sugestão (com o nome de quem sugeriu). Não muda nada no site. */
export async function createSuggestionAction(formData: FormData) {
  if (!(await isAdminSession())) redirect("/admin/login");
  const author = String(formData.get("author") ?? "").trim().slice(0, 60);
  const section = String(formData.get("section") ?? "");
  const suggestion = String(formData.get("suggestion") ?? "").trim().slice(0, 2000);
  const reason = String(formData.get("reason") ?? "").trim().slice(0, 1000);
  const questionId = String(formData.get("questionId") ?? "").trim() || null;
  if (author.length < 2 || suggestion.length < 3 || !SUGGESTION_SECTIONS.includes(section)) redirect("/admin/sugestoes?erro=1");
  await getPrisma().changeSuggestion.create({ data: { author, section, suggestion, reason, questionId } });
  revalidatePath("/admin/sugestoes");
  redirect("/admin/sugestoes?enviada=1");
}

/** Responde a uma sugestão: aceita ou recusa, com comentário e nome de quem respondeu. */
export async function respondSuggestionAction(formData: FormData) {
  if (!(await isAdminSession())) redirect("/admin/login");
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");
  const respondedBy = String(formData.get("respondedBy") ?? "").trim().slice(0, 60);
  const response = String(formData.get("response") ?? "").trim().slice(0, 1000);
  if (!id || !["aceita", "recusada", "aberta"].includes(status) || respondedBy.length < 2) redirect(`/admin/sugestoes?erro=2#s${id}`);
  if (status === "recusada" && response.length < 3) redirect(`/admin/sugestoes?erro=recusa#s${id}`);
  await getPrisma().changeSuggestion.update({ where: { id }, data: { status, response: response || null, respondedBy, respondedAt: new Date() } });
  revalidatePath("/admin/sugestoes");
  redirect(`/admin/sugestoes#s${id}`);
}
