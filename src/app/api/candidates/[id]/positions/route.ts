import { getContentRepository } from "@/lib/repository";
import { json, notFound } from "@/lib/api";
import { NO_EVIDENCE_MESSAGE } from "@/domain/types";

/** Posições PUBLICADAS. Perguntas sem posição aparecem com estado explícito. */
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const repo = await getContentRepository();
  const candidate = await repo.getCandidate(id);
  if (!candidate) return notFound("Candidato não encontrado.");
  const [questions, positions] = await Promise.all([repo.getQuestions(), repo.getPublishedPositions(candidate.id)]);
  return json({
    candidateId: candidate.id,
    items: questions.map((q) => {
      const pos = positions.filter((p) => p.questionId === q.id);
      return { questionId: q.id, status: pos.length ? "DOCUMENTED" : "INSUFFICIENT_EVIDENCE", message: pos.length ? null : NO_EVIDENCE_MESSAGE, positions: pos };
    }),
  });
}

export const dynamic = "force-dynamic";
