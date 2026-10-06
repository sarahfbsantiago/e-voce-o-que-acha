import { getContentRepository } from "@/lib/repository";
import { json, notFound } from "@/lib/api";
import { NO_EVIDENCE_MESSAGE } from "@/domain/types";

/**
 * Evidências PUBLICADAS por candidato para uma pergunta.
 * Ausência de evidência retorna estado explícito, nunca um valor inferido.
 */
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const repo = await getContentRepository();
  const question = await repo.getQuestion(id);
  if (!question) return notFound("Pergunta não encontrada.");
  const [candidates, evidence, positions] = await Promise.all([
    repo.getCandidates(),
    repo.getPublishedEvidence({ questionId: id }),
    repo.getPublishedPositions(),
  ]);
  return json({
    questionId: id,
    candidates: candidates.map((c) => {
      const ev = evidence.filter((e) => e.candidateId === c.id);
      const pos = positions.filter((p) => p.candidateId === c.id && p.questionId === id);
      return {
        candidateId: c.id,
        name: c.name,
        status: pos.length > 0 ? "DOCUMENTED" : "INSUFFICIENT_EVIDENCE",
        message: pos.length > 0 ? null : NO_EVIDENCE_MESSAGE,
        positions: pos,
        evidence: ev,
      };
    }),
  });
}

export const dynamic = "force-dynamic";
