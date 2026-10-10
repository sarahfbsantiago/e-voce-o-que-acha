import { getContentRepository, getStatsRepository } from "@/lib/repository";
import { aggregateProfileProximity } from "@/domain/profile-proximity";
import { QUESTIONS } from "@/data/questions";
import { isAdminRequest } from "@/lib/admin-auth";
import { buildResearchReport, researchReportToCsv } from "@/lib/research-report";
import { ensureLiveConfig } from "@/lib/live-config-server";
import { json } from "@/lib/api";

/** Dados agregados da pesquisa (privado). ?format=csv exporta CSV. */
export async function GET(req: Request) {
  await ensureLiveConfig();
  if (!isAdminRequest(req)) return json({ error: "Não autorizado." }, { status: 401 });
  const stats = await getStatsRepository();
  if (!stats.enabled) return json({ error: "Estatísticas indisponíveis: banco de dados não configurado." }, { status: 503 });
  const content = await getContentRepository();
  const [submissions, feedback, candidates, positions] = await Promise.all([stats.listSubmissions(), stats.listFeedback(), content.getCandidates(), content.getPublishedPositions()]);
  const report = buildResearchReport(submissions, feedback, aggregateProfileProximity(submissions, QUESTIONS, candidates, positions));
  if (new URL(req.url).searchParams.get("format") === "csv") {
    return new Response(researchReportToCsv(report), {
      headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": 'attachment; filename="pesquisa-agregada.csv"', "cache-control": "no-store" },
    });
  }
  return json(report);
}

export const dynamic = "force-dynamic";
