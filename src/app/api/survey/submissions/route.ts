import { getStatsRepository, StatsUnavailableError } from "@/lib/repository";
import { SubmissionSchema } from "@/lib/validation";
import { badRequest, json } from "@/lib/api";

/**
 * Recebe um envio anônimo (somente com consentimento dado no navegador).
 * - Schema estrito: qualquer campo fora do previsto (nome, email, IP…) é rejeitado.
 * - Nenhum IP ou user agent é lido ou armazenado aqui.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest("Corpo inválido.");
  }
  const parsed = SubmissionSchema.safeParse(body);
  if (!parsed.success) return badRequest("Envio inválido.", parsed.error.flatten());

  const stats = await getStatsRepository();
  try {
    const { id } = await stats.saveSubmission(parsed.data);
    return json({ ok: true, id }, { status: 201 });
  } catch (e) {
    if (e instanceof StatsUnavailableError) return json({ ok: false, error: e.message }, { status: 503 });
    throw e;
  }
}

export const dynamic = "force-dynamic";
