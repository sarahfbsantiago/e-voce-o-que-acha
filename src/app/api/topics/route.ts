import { getContentRepository } from "@/lib/repository";
import { json } from "@/lib/api";

export async function GET() {
  const repo = await getContentRepository();
  return json({ topics: await repo.getTopics() });
}

export const dynamic = "force-dynamic";
