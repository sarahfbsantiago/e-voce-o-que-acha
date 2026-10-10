"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";

async function guard() {
  if (!(await isAdminSession())) redirect("/admin/login");
}

/** Publica uma posição e as evidências ligadas a ela, com registro de auditoria. */
export async function publishPositionAction(formData: FormData) {
  await guard();
  const id = String(formData.get("id") ?? "");
  const prisma = getPrisma();
  const pos = await prisma.candidatePosition.findUnique({ where: { id }, include: { evidences: true } });
  if (!pos) return;
  await prisma.$transaction([
    prisma.candidatePosition.update({ where: { id }, data: { reviewStatus: "PUBLISHED" } }),
    prisma.evidence.updateMany({ where: { id: { in: pos.evidences.map((e) => e.evidenceId) } }, data: { reviewStatus: "PUBLISHED" } }),
    prisma.auditLog.create({ data: { actor: "admin", operation: "PUBLISH", entity: "CandidatePosition", entityId: id, before: { reviewStatus: pos.reviewStatus }, after: { reviewStatus: "PUBLISHED" }, reason: "Revisão humana em /admin/posicoes" } }),
  ]);
  revalidatePath("/admin/posicoes");
  revalidatePath("/relatorio");
}

/** Rejeita uma posição (não aparece no site; pode ser reimportada como rascunho só se voltar a DRAFT). */
export async function rejectPositionAction(formData: FormData) {
  await guard();
  const id = String(formData.get("id") ?? "");
  const prisma = getPrisma();
  const pos = await prisma.candidatePosition.findUnique({ where: { id } });
  if (!pos) return;
  await prisma.$transaction([
    prisma.candidatePosition.update({ where: { id }, data: { reviewStatus: "REJECTED" } }),
    prisma.auditLog.create({ data: { actor: "admin", operation: "REJECT", entity: "CandidatePosition", entityId: id, before: { reviewStatus: pos.reviewStatus }, after: { reviewStatus: "REJECTED" }, reason: "Revisão humana em /admin/posicoes" } }),
  ]);
  revalidatePath("/admin/posicoes");
  revalidatePath("/relatorio");
}

/** Volta uma posição para rascunho (despublica). */
export async function unpublishPositionAction(formData: FormData) {
  await guard();
  const id = String(formData.get("id") ?? "");
  const prisma = getPrisma();
  const pos = await prisma.candidatePosition.findUnique({ where: { id }, include: { evidences: true } });
  if (!pos) return;
  await prisma.$transaction([
    prisma.candidatePosition.update({ where: { id }, data: { reviewStatus: "DRAFT" } }),
    prisma.evidence.updateMany({ where: { id: { in: pos.evidences.map((e) => e.evidenceId) } }, data: { reviewStatus: "DRAFT" } }),
    prisma.auditLog.create({ data: { actor: "admin", operation: "UNPUBLISH", entity: "CandidatePosition", entityId: id, before: { reviewStatus: pos.reviewStatus }, after: { reviewStatus: "DRAFT" }, reason: "Revisão humana em /admin/posicoes" } }),
  ]);
  revalidatePath("/admin/posicoes");
  revalidatePath("/relatorio");
}

/** Publica todos os rascunhos de uma vez (exige digitar PUBLICAR). */
export async function publishAllDraftsAction(formData: FormData) {
  await guard();
  if (String(formData.get("confirm") ?? "") !== "PUBLICAR") return;
  const prisma = getPrisma();
  const drafts = await prisma.candidatePosition.findMany({ where: { reviewStatus: "DRAFT" }, include: { evidences: true } });
  const evidenceIds = drafts.flatMap((p) => p.evidences.map((e) => e.evidenceId));
  await prisma.$transaction([
    prisma.candidatePosition.updateMany({ where: { reviewStatus: "DRAFT" }, data: { reviewStatus: "PUBLISHED" } }),
    prisma.evidence.updateMany({ where: { id: { in: evidenceIds } }, data: { reviewStatus: "PUBLISHED" } }),
    prisma.auditLog.create({ data: { actor: "admin", operation: "PUBLISH_ALL", entity: "CandidatePosition", entityId: `batch-${new Date().toISOString()}`, reason: `Publicação em lote de ${drafts.length} posições após revisão humana em /admin/posicoes` } }),
  ]);
  revalidatePath("/admin/posicoes");
  revalidatePath("/relatorio");
}
