import { getContentRepository } from "@/lib/repository";
import { ensureLiveConfig } from "@/lib/live-config-server";
import { json } from "@/lib/api";

export async function GET() {
  await ensureLiveConfig();
  const repo = await getContentRepository();
  const [questions, topics] = await Promise.all([repo.getQuestions(), repo.getTopics()]);
  return json({ topics, questions });
}

export const dynamic = "force-dynamic";
