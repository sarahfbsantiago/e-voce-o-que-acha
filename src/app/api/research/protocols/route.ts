import { getContentRepository } from "@/lib/repository";
import { json } from "@/lib/api";

export async function GET(req: Request) {
  const questionId = new URL(req.url).searchParams.get("questionId");
  const repo = await getContentRepository();
  const protocols = await repo.getResearchProtocols();
  return json({ protocols: questionId ? protocols.filter((p) => p.questionId === questionId) : protocols });
}

export const dynamic = "force-dynamic";
