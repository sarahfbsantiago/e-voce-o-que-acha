import { getContentRepository } from "@/lib/repository";
import { json, notFound } from "@/lib/api";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const repo = await getContentRepository();
  const question = await repo.getQuestion(id);
  if (!question) return notFound("Pergunta não encontrada.");
  const [notes, args, protocols] = await Promise.all([repo.getContextNotes(), repo.getArgumentSets(), repo.getResearchProtocols()]);
  return json({
    question,
    contextNotes: notes.filter((n) => question.contextNoteIds?.includes(n.id)),
    arguments: args.find((a) => a.id === question.argumentsId) ?? null,
    researchProtocol: protocols.find((p) => p.questionId === question.id) ?? null,
  });
}

export const dynamic = "force-dynamic";
