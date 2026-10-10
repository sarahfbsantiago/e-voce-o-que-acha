import { getStatsRepository } from "@/lib/repository";
import { getResearchReport } from "@/lib/research-cache";
import { isAdminRequest } from "@/lib/admin-auth";
import { researchReportToCsv } from "@/lib/research-report";
import { ensureLiveConfig } from "@/lib/live-config-server";
import { json } from "@/lib/api";

/** Dados agregados da pesquisa (privado). ?format=csv exporta CSV. */
export async function GET(req: Request) {
  await ensureLiveConfig();
  if (!isAdminRequest(req)) return json({ error: "Não autorizado." }, { status: 401 });
  const stats = await getStatsRepository();
  if (!stats.enabled) return json({ error: "Estatísticas indisponíveis: banco de dados não configurado." }, { status: 503 });
  const { report } = await getResearchReport();
  if (new URL(req.url).searchParams.get("format") === "csv") {
    return new Response(researchReportToCsv(report), {
      headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": 'attachment; filename="pesquisa-agregada.csv"', "cache-control": "no-store" },
    });
  }
  return json(report);
}

export const dynamic = "force-dynamic";
