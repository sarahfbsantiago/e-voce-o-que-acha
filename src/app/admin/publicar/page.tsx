import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { AdminHero, AdminShell, Kpi, Panel } from "@/components/admin/AdminUI";
import { buildDraftPlan } from "@/lib/publish-plan";
import { getPublishedConfig, listRequests } from "@/lib/live-config-server";

export const metadata: Metadata = { title: "Pedidos", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export const SECTION_COLOR: Record<string, string> = { "Notas por alternativa": "#6d3fc4", "Espectro político": "#2563eb", "Régua": "#ec4899", "Perguntas": "#2f9a5d", "Textos do site": "#d4a017", "Revisão de posições": "#0f766e", "Fontes e links": "#0891b2" };
const when = (d: Date) => d.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

/** Pedidos: mudanças enviadas para outra pessoa aprovar (como pull requests). */
export default async function Page({ searchParams }: { searchParams: Promise<{ fechado?: string; reaberto?: string }> }) {
  if (!(await isAdminSession())) redirect("/admin/login");
  const sp = await searchParams;
  const [draft, requests, pub] = await Promise.all([buildDraftPlan(), listRequests(), getPublishedConfig(true)]);
  const open = requests.filter((r) => r.status === "aberto");
  const closed = requests.filter((r) => r.status !== "aberto");
  const STATUS: Record<string, string> = { aprovado: "bg-mint text-white", recusado: "bg-[#9b1c1c] text-white", cancelado: "bg-line text-ink-2" };

  return (
    <AdminShell current="/admin/publicar">
      <AdminHero kicker="Aprovação" title="Pedidos" pdfTitle="Pedidos"
        subtitle="Mudanças enviadas para outra pessoa aprovar. Para publicar você mesma, use a aba Rascunho." />
      {sp.fechado ? <p className="rounded-2xl bg-paper p-4 text-sm font-semibold text-ink-2 ring-1 ring-line">Pedido #{sp.fechado} fechado.</p> : null}
      {sp.reaberto ? <p className="rounded-2xl bg-gold-soft p-4 text-sm font-semibold text-gold-strong">As mudanças do pedido voltaram para o <Link href="/admin/rascunho" className="underline">Rascunho</Link>.</p> : null}

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi label="No rascunho" value={String(draft.changes.length)} note="em Rascunho" color="#f97316" />
        <Kpi label="Aguardando aprovação" value={String(open.length)} color="#6d3fc4" />
        <Kpi label="Aprovados" value={String(closed.filter((r) => r.status === "aprovado").length)} color="#2f9a5d" />
        <Kpi label="Versão no ar" value={`v${pub.version}`} color="#2563eb" />
      </section>

      <Panel title="Aguardando aprovação" subtitle="Abra um pedido para revisar e aprovar ou recusar" accent="#6d3fc4">
        {open.length ? (
          <ul className="space-y-2">
            {open.map((r) => {
              const stale = r.baseVersion !== pub.version;
              return (
                <li key={r.id}>
                  <Link href={`/admin/publicar/${r.id}`} className="flex flex-wrap items-center gap-3 rounded-xl bg-paper/60 px-4 py-3 ring-1 ring-line hover:bg-purple-soft/40">
                    <span className="rounded-lg bg-ink px-2 py-0.5 text-xs font-bold text-white">#{r.id}</span>
                    <span className="min-w-0 flex-1 text-sm"><b>{r.author}</b>: {r.note} <span className="text-ink-3">· {r.changes.length} mudanças{r.rollbackOf ? ` · volta para v${r.rollbackOf}` : ""}</span></span>
                    {stale ? <span className="rounded-full bg-[#fde8e8] px-2 py-0.5 text-[11px] font-bold text-[#9b1c1c]">desatualizado</span> : <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[11px] font-bold text-gold-strong">aguardando</span>}
                    <span className="text-xs text-ink-3">{when(r.createdAt)}</span>
                    <span className="text-sm font-bold text-purple-strong">Revisar →</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : <p className="text-sm text-ink-3">Nenhum pedido aguardando.</p>}
      </Panel>

      {closed.length ? (
        <Panel title="Pedidos fechados">
          <ul className="space-y-1.5 text-sm">
            {closed.slice(0, 30).map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-2 rounded-lg px-3 py-2 ring-1 ring-line">
                <span className="rounded bg-ink px-1.5 text-xs font-bold text-white">#{r.id}</span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${STATUS[r.status] ?? ""}`}>{r.status}{r.publishedVersion ? ` · v${r.publishedVersion}` : ""}</span>
                <span className="min-w-0 flex-1 text-ink-2"><b>{r.author}</b>: {r.note}</span>
                {r.reviewedBy ? <span className="text-xs text-ink-3">por {r.reviewedBy}{r.reviewNote ? ` (“${r.reviewNote}”)` : ""}</span> : null}
                <Link href={`/admin/publicar/${r.id}`} className="text-xs font-semibold text-purple underline">ver</Link>
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}
    </AdminShell>
  );
}
