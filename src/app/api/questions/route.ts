import { getContentRepository } from "@/lib/repository";
import { json } from "@/lib/api";

export async function GET() {
  const repo = await getContentRepository();
  const [questions, topics] = await Promise.all([repo.getQuestions(), repo.getTopics()]);
  return json({ topics, questions });
}

export const dynamic = "force-dynamic";
