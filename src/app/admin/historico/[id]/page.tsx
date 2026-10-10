import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { AdminHero, AdminShell, Panel } from "@/components/admin/AdminUI";
import { MiniRuler } from "@/components/admin/MiniRuler";
import { getPublishedConfig, getVersion, listVersions } from "@/lib/live-config-server";
import { diffConfig } from "@/lib/live-config";

export const metadata: Metadata = { title: "Versão", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/** Detalhe de uma versão e comparação com outra (por padrão, a que está no ar). */
export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ com?: string }> }) {
  if (!(await isAdminSession())) redirect("/admin/login");
  const id = Number((await params).id);
  const v = await getVersion(id);
  if (!v) notFound();
  const pub = await getPublishedConfig(true);
  const otherId = Number((await searchParams).com ?? pub.version);
  const other = otherId === id ? null : await getVersion(otherId);
  const versions = await listVersions();
  const diff = other ? diffConfig(v.cfg, other.cfg) : [];
  const imp = "summary" in v.row.impact ? v.row.impact.summary : [];

  return (
    <AdminShell current="/admin/historico">
      <AdminHero kicker="Histórico" title={`Versão v${id}`} pdfTitle={`Versão v${id}`} subtitle={`${v.row.author} · ${v.row.createdAt.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })} · ${v.row.reason}`} />
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Mudanças desta versão" subtitle="Em relação à versão anterior">
          {v.row.changes.length ? <ul className="max-h-96 space-y-1 overflow-y-auto text-sm text-ink-2">{v.row.changes.map((c, i) => <li key={i} className="rounded bg-paper/60 px-2 py-1"><b className="text-ink">{c.section}:</b> {c.text}</li>)}</ul> : <p className="text-sm text-ink-3">Versão inicial.</p>}
        </Panel>
        <Panel title="Impacto registrado na publicação">
          {imp.length ? <ul className="space-y-1 text-sm">{imp.map((s) => <li key={s} className="rounded bg-[#fff4e5] px-2 py-1 text-[#7a4a00]">{s}</li>)}</ul> : <p className="text-sm text-ink-3">—</p>}
        </Panel>
      </div>
      <Panel title="Comparar com outra versão" subtitle="Escolha a versão para comparar"
        right={<div className="flex flex-wrap gap-1">{versions.filter((x) => x.id !== id).slice(0, 12).map((x) => <Link key={x.id} href={`/admin/historico/${id}?com=${x.id}`} className={`rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ${x.id === otherId ? "bg-purple text-white ring-purple" : "bg-surface text-ink-2 ring-line"}`}>v{x.id}{x.id === pub.version ? " (no ar)" : ""}</Link>)}</div>}>
        {other ? (
          <div className="space-y-4">
            <div className="grid gap-3 lg:grid-cols-2"><MiniRuler cfg={v.cfg} label={`v${id}`} /><MiniRuler cfg={other.cfg} label={`v${otherId}`} highlight /></div>
            <p className="text-xs font-bold uppercase tracking-wide text-ink-3">De v{id} para v{otherId}: {diff.length} diferenças</p>
            <ul className="max-h-96 space-y-1 overflow-y-auto text-sm text-ink-2">{diff.map((c, i) => <li key={i} className="rounded bg-paper/60 px-2 py-1"><b className="text-ink">{c.section}:</b> {c.text}</li>)}</ul>
          </div>
        ) : <p className="text-sm text-ink-3">Esta é a versão no ar.</p>}
      </Panel>
      <div className="flex flex-wrap gap-2">
        <Link href="/admin/historico" className="rounded-lg bg-surface px-3 py-2 text-sm font-semibold text-ink-2 ring-1 ring-line">← Histórico</Link>
        {id !== pub.version ? <Link href={`/admin/publicar?rollback=${id}`} className="rounded-lg bg-[#ec4899] px-3 py-2 text-sm font-bold text-white">Voltar para esta versão</Link> : null}
      </div>
    </AdminShell>
  );
}
