import { getContentRepository } from "@/lib/repository";
import { json, notFound } from "@/lib/api";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const repo = await getContentRepository();
  const source = await repo.getSource(id);
  if (!source) return notFound("Fonte não encontrada.");
  return json({ source });
}

export const dynamic = "force-dynamic";
