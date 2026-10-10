import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { AdminHero, AdminShell, Kpi, Panel } from "@/components/admin/AdminUI";
import { TextTreeEditor } from "@/components/admin/TextTreeEditor";
import { SubmitItem } from "@/components/admin/SubmitItem";
import { AddSource, RemoveSource } from "@/components/admin/SourceTools";
import { getWorkingConfig } from "@/lib/live-config-server";
import { contentOf, sameJson } from "@/lib/live-config";

export const metadata: Metadata = { title: "Fontes e links", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type Json = Parameters<typeof TextTreeEditor>[0]["value"];

/** Fontes e links: editar nome, instituição, link e uso de cada fonte; adicionar e remover. */
export default async function Page() {
  if (!(await isAdminSession())) redirect("/admin/login");
  const { cfg, published } = await getWorkingConfig();
  const list = contentOf(cfg).sources ?? [];
  const live = contentOf(published.cfg).sources ?? [];
  const same = sameJson;
  const listChanged = !same(list.map((s) => s.id), live.map((s) => s.id));
  const byInst = [...list.map((s, i) => ({ s, i }))].sort((a, b) => a.s.institution.localeCompare(b.s.institution, "pt-BR"));

  return (
    <AdminShell current="/admin/fontes">
      <AdminHero kicker="Conteúdo" title="Fontes e links" pdfTitle="Fontes e links" subtitle="Revise nome, instituição, link e uso de cada fonte da página Fontes. Teste os links. Edite, adicione ou remova e envie para aprovação." />
      <section className="grid grid-cols-2 gap-3 xl:grid-cols-3">
        <Kpi label="Fontes" value={String(list.length)} color="#0891b2" />
        <Kpi label="No ar" value={String(live.length)} color="#2f9a5d" />
        <Kpi label="Alteradas no rascunho" value={String(list.filter((s) => !same(s, live.find((x) => x.id === s.id))).length)} color="#f97316" />
      </section>
      <Panel title="Adicionar fonte" accent="#0891b2">
        <AddSource />
        <SubmitItem scope={{ kind: "content", path: ["sources"] }} changed={listChanged} what="Lista de fontes (inclusões e remoções)" />
      </Panel>
      <div className="space-y-2">
        {byInst.map(({ s, i }) => {
          const old = live.find((x) => x.id === s.id);
          const changed = !same(s, old);
          return (
            <details key={s.id} className="group overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-black/5">
              <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3 px-4 py-3">
                <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-full bg-[#cffafe] text-xs font-bold text-[#0e7490] transition-transform group-open:rotate-90">›</span>
                <span className="min-w-0 flex-1 text-sm"><b className="text-ink">{s.name}</b> <span className="text-xs text-ink-3">· {s.institution}</span></span>
                {!old ? <span className="rounded-full bg-[#f97316] px-2 py-0.5 text-[10px] font-bold text-white">nova</span> : changed ? <span className="rounded-full bg-[#f97316] px-2 py-0.5 text-[10px] font-bold text-white">no rascunho</span> : null}
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-purple underline">abrir ↗</a>
              </summary>
              <div className="space-y-3 border-t border-line p-4">
                <TextTreeEditor path={["sources", i]} value={JSON.parse(JSON.stringify(s)) as Json} published={JSON.parse(JSON.stringify(old ?? s)) as Json} />
                {old ? <SubmitItem scope={{ kind: "content", path: ["sources", i] }} changed={changed && !listChanged} what="Esta fonte" /> : null}
                <RemoveSource id={s.id} />
              </div>
            </details>
          );
        })}
      </div>
    </AdminShell>
  );
}
