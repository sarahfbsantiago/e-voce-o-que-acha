import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { AdminHero, AdminShell, Kpi } from "@/components/admin/AdminUI";
import { getPublishedConfig, listVersions } from "@/lib/live-config-server";

export const metadata: Metadata = { title: "Histórico de mudanças", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

import { SECTION_COLOR } from "../publicar/page";
const when = (d: Date) => d.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default async function Page({ searchParams }: { searchParams: Promise<{ publicado?: string; secao?: string; pessoa?: string }> }) {
  if (!(await isAdminSession())) redirect("/admin/login");
  const sp = await searchParams;
  const [all, pub] = await Promise.all([listVersions(), getPublishedConfig(true)]);
  const people = [...new Set(all.map((v) => v.author))];
  const sections = [...new Set(all.flatMap((v) => v.sections))];
  const rows = all.filter((v) => (!sp.secao || v.sections.includes(sp.secao)) && (!sp.pessoa || v.author === sp.pessoa));
  const chip = (href: string, label: string, active: boolean) => <Link key={href} href={href} className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${active ? "bg-purple text-white ring-purple" : "bg-surface text-ink-2 ring-line hover:bg-paper"}`}>{label}</Link>;

  return (
    <AdminShell current="/admin/historico">
      <AdminHero kicker="Auditoria" title="Histórico de mudanças" pdfTitle="Histórico de mudanças"
        subtitle="Cada publicação é uma versão: quem mudou, o quê, por quê e o impacto no cálculo. Registros não podem ser apagados nem editados. Dá para voltar para qualquer versão."
        extra={<a href="/api/admin/historico" className="inline-flex min-h-10 items-center rounded-lg bg-white/15 px-3 py-2 text-sm font-semibold ring-1 ring-white/30 hover:bg-white/25">CSV</a>} />

      {sp.publicado ? <p className="rounded-2xl bg-mint-soft p-4 text-sm font-semibold text-mint-strong ring-1 ring-mint/30">Publicado: versão v{sp.publicado} já está no site.</p> : null}

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi label="Versão no ar" value={`v${pub.version}`} color="#2f9a5d" />
        <Kpi label="Publicações" value={String(all.length)} color="#6d3fc4" />
        <Kpi label="Rollbacks" value={String(all.filter((v) => v.rollbackOf).length)} color="#ec4899" />
        <Kpi label="Pessoas" value={String(people.length)} note={people.join(", ")} color="#2563eb" small />
      </section>

      <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-surface p-3 shadow-sm ring-1 ring-black/5">
        <span className="text-xs font-bold text-ink-3">Seção:</span>
        {chip("/admin/historico", "Todas", !sp.secao && !sp.pessoa)}
        {sections.map((s) => chip(`/admin/historico?secao=${encodeURIComponent(s)}`, s, sp.secao === s))}
        <span className="ml-2 text-xs font-bold text-ink-3">Pessoa:</span>
        {people.map((p) => chip(`/admin/historico?pessoa=${encodeURIComponent(p)}`, p, sp.pessoa === p))}
      </div>

      <ol className="relative space-y-4 border-l-2 border-purple/30 pl-6">
        {rows.map((v) => {
          const live = v.id === pub.version;
          const imp = "summary" in v.impact ? v.impact.summary : [];
          return (
            <li key={v.id} className="relative">
              <span aria-hidden="true" className={`absolute -left-[33px] top-4 h-4 w-4 rounded-full ring-4 ring-[#f3f2ef] ${live ? "bg-mint" : "bg-purple"}`} />
              <article className="overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-black/5">
                <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3">
                  <span className="rounded-lg bg-ink px-2 py-0.5 text-xs font-bold text-white">v{v.id}</span>
                  {live ? <span className="rounded-full bg-mint px-2 py-0.5 text-[11px] font-bold text-white">no ar</span> : null}
                  {v.rollbackOf ? <span className="rounded-full bg-[#ec4899] px-2 py-0.5 text-[11px] font-bold text-white">rollback para v{v.rollbackOf}</span> : null}
                  <p className="text-sm text-ink"><b>{v.author}</b> {v.changes.length ? <>mudou <b>{v.changes.length} {v.changes.length === 1 ? "item" : "itens"}</b> em {v.sections.map((s, i) => <span key={s}>{i ? ", " : ""}<b style={{ color: SECTION_COLOR[s] }}>{s}</b></span>)}</> : "criou a versão inicial"}{v.approvedBy ? <span className="text-ink-3"> · aprovado por <b className="text-ink">{v.approvedBy}</b></span> : null}</p>
                  <span className="ml-auto text-xs text-ink-3">{when(v.createdAt)}</span>
                </div>
                <div className="grid gap-4 p-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-ink-3">Motivo</p>
                    <p className="text-sm text-ink-2">{v.reason}</p>
                    {v.changes.length ? (
                      <ul className="mt-2 space-y-1 text-xs text-ink-2">
                        {v.changes.slice(0, 4).map((c, i) => <li key={i}>• {c.text}</li>)}
                        {v.changes.length > 4 ? <li className="text-ink-3">+{v.changes.length - 4} mudanças</li> : null}
                      </ul>
                    ) : null}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-ink-3">Impacto no cálculo</p>
                    {imp.length ? <ul className="mt-1 space-y-1 text-xs">{imp.map((s) => <li key={s} className="rounded bg-[#fff4e5] px-2 py-1 text-[#7a4a00]">{s}</li>)}</ul> : <p className="text-xs text-ink-3">—</p>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 border-t border-line bg-paper/40 px-4 py-2.5">
                  <Link href={`/admin/historico/${v.id}`} className="rounded-lg bg-surface px-3 py-1.5 text-xs font-bold text-ink-2 ring-1 ring-line hover:bg-paper">Ver detalhe e comparar</Link>
                  {!live ? <Link href={`/admin/publicar/voltar/${v.id}`} className="rounded-lg bg-[#ec4899] px-3 py-1.5 text-xs font-bold text-white shadow-sm">Voltar para esta versão</Link> : null}
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </AdminShell>
  );
}
