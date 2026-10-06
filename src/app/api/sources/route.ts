import { getContentRepository } from "@/lib/repository";
import { json } from "@/lib/api";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const institution = url.searchParams.get("institution");
  const legend = url.searchParams.get("legend");
  const type = url.searchParams.get("type");
  const repo = await getContentRepository();
  let sources = await repo.getSources();
  if (institution) sources = sources.filter((s) => s.institution.toLowerCase().includes(institution.toLowerCase()));
  if (legend) sources = sources.filter((s) => s.legend === legend);
  if (type) sources = sources.filter((s) => s.type === type);
  return json({ sources });
}

export const dynamic = "force-dynamic";
