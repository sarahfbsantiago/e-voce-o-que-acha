"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";

/** Comentário com nome numa sugestão ou num pedido de publicação. */
export async function addCommentAction(formData: FormData) {
  if (!(await isAdminSession())) redirect("/admin/login");
  const target = String(formData.get("target") ?? "");
  const targetId = Number(formData.get("targetId"));
  const author = String(formData.get("author") ?? "").trim().slice(0, 60);
  const body = String(formData.get("body") ?? "").trim().slice(0, 2000);
  const back = target === "pedido" ? `/admin/publicar/${targetId}` : `/admin/sugestoes`;
  if (!["sugestao", "pedido"].includes(target) || !targetId) redirect("/admin");
  if (author.length < 2 || body.length < 2) redirect(`${back}?erro=comentario#c-${target}-${targetId}`);
  await getPrisma().adminComment.create({ data: { target, targetId, author, body } });
  revalidatePath(back);
  redirect(`${back}#c-${target}-${targetId}`);
}
