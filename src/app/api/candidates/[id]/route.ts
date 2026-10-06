import { getContentRepository } from "@/lib/repository";
import { json, notFound } from "@/lib/api";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const repo = await getContentRepository();
  const candidate = await repo.getCandidate(id);
  if (!candidate) return notFound("Candidato não encontrado.");
  const sources = await repo.getSources();
  return json({ candidate, historySources: sources.filter((s) => candidate.historySourceIds.includes(s.id)) });
}

export const dynamic = "force-dynamic";
