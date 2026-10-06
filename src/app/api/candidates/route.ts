import { getContentRepository } from "@/lib/repository";
import { json } from "@/lib/api";

export async function GET() {
  const repo = await getContentRepository();
  return json({ candidates: await repo.getCandidates() });
}

export const dynamic = "force-dynamic";
