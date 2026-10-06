import { getStatsRepository, StatsUnavailableError } from "@/lib/repository";
import { FeedbackSchema } from "@/lib/validation";
import { badRequest, json } from "@/lib/api";

/** Avaliação anônima da pesquisa: nota (1–5) e se ajudou na decisão. */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest("Corpo inválido.");
  }
  const parsed = FeedbackSchema.safeParse(body);
  if (!parsed.success) return badRequest("Avaliação inválida.", parsed.error.flatten());
  const stats = await getStatsRepository();
  try {
    const { id } = await stats.saveFeedback(parsed.data);
    return json({ ok: true, id }, { status: 201 });
  } catch (e) {
    if (e instanceof StatsUnavailableError) return json({ ok: false, error: e.message }, { status: 503 });
    throw e;
  }
}

export const dynamic = "force-dynamic";
