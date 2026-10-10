import { isAdminRequest } from "@/lib/admin-auth";
import { listVersions } from "@/lib/live-config-server";

/** Histórico de mudanças em CSV (só admin). */
export async function GET(req: Request) {
  if (!isAdminRequest(req)) return new Response("Não autorizado.", { status: 401 });
  const rows = await listVersions();
  const q = (s: string) => `"${s.replaceAll('"', '""')}"`;
  const lines = ["versao,data,pessoa,motivo,secoes,rollback_de,mudancas,impacto"];
  for (const v of rows) {
    const imp = "summary" in v.impact ? v.impact.summary.join(" | ") : "";
    lines.push([`v${v.id}`, v.createdAt.toISOString(), q(v.author), q(v.reason), q(v.sections.join(" | ")), v.rollbackOf ?? "", q(v.changes.map((c) => `${c.section}: ${c.text}`).join(" | ")), q(imp)].join(","));
  }
  return new Response(lines.join("\n"), { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": "attachment; filename=historico-admin.csv" } });
}
