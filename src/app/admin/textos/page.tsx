import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { AdminHero, AdminShell, Kpi, SectionTitle } from "@/components/admin/AdminUI";
import { TextTreeEditor } from "@/components/admin/TextTreeEditor";
import { getWorkingConfig } from "@/lib/live-config-server";
import { contentOf, sameJson } from "@/lib/live-config";
import { SPECTRUM_TERMS } from "@/data/spectrum-terms";
import { SubmitItem } from "@/components/admin/SubmitItem";

export const metadata: Metadata = { title: "Textos do site", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type Json = Parameters<typeof TextTreeEditor>[0]["value"];
const PAGES: [string, string][] = [["home", "Página inicial"], ["startCta", "Chamada \"Começar\" (rodapé das páginas)"], ["footer", "Rodapé"], ["comoFunciona", "Como funciona"], ["metodologia", "Metodologia"], ["report", "Relatório (mensagem final e rodapé)"]];

function Item({ title, hint, changed, children }: { title: string; hint?: string; changed: boolean; children: ReactNode }) {
  return (
    <details className="group overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-black/5">
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3">
        <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-full bg-purple-soft text-xs font-bold text-purple-strong transition-transform group-open:rotate-90">›</span>
        <span className="min-w-0 flex-1 text-sm font-bold text-ink">{title}{hint ? <span className="ml-2 text-xs font-normal text-ink-3">{hint}</span> : null}</span>
        {changed ? <span className="rounded-full bg-[#f97316] px-2 py-0.5 text-[10px] font-bold text-white">no rascunho</span> : null}
      </summary>
      <div className="border-t border-line p-4">{children}</div>
    </details>
  );
}

/** Textos do site e do relatório (tudo menos as perguntas): editar no rascunho e enviar para publicação. */
export default async function Page() {
  if (!(await isAdminSession())) redirect("/admin/login");
  const { cfg, published } = await getWorkingConfig();
  const w = contentOf(cfg), p = contentOf(published.cfg);
  const j = (x: unknown) => JSON.parse(JSON.stringify(x)) as Json;
  const diff = (a: unknown, b: unknown) => !sameJson(a, b);
  const ed = (path: (string | number)[], a: unknown, b: unknown) => (
    <>
      <TextTreeEditor path={path} value={j(a)} published={j(b)} />
      <SubmitItem scope={{ kind: "content", path }} changed={diff(a, b)} what="Este texto" />
    </>
  );

  return (
    <AdminShell current="/admin/textos">
      <AdminHero kicker="Conteúdo" title="Textos do site" pdfTitle="Textos do site"
        subtitle="Edite os textos das páginas e do relatório: perfis ideológicos, cards das correntes, contexto histórico e personagens, Visão Lula/Flávio e currículos. Não mexe na conta. As perguntas ficam na aba Perguntas." />
      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi label="Perfis ideológicos" value={String(Object.keys(w.profiles).length)} color="#6d3fc4" />
        <Kpi label="Cards das correntes" value={String(w.spectrumSections.length)} color="#ec4899" />
        <Kpi label="Contextos históricos" value={String(Object.keys(w.history).length)} color="#d4a017" />
        <Kpi label="Currículos" value={String(w.candidateProfiles.length)} color="#2f9a5d" />
      </section>
      <p className="rounded-2xl bg-paper p-3 text-xs text-ink-2 ring-1 ring-line">Dica: <b>**texto**</b> vira negrito na Metodologia; <b>{"{perguntas}"}</b> e <b>{"{temas}"}</b> viram as contagens atuais. Fotos de personagens: use o nome de um arquivo já existente (ex.: marx, lenin, mussolini); para foto nova, peça para incluir o arquivo.</p>

      <SectionTitle n={1} label="Páginas do site" color="#2563eb" />
      <div className="space-y-2">{PAGES.map(([k, t]) => <Item key={k} title={t} changed={diff((w.pages as unknown as Record<string, unknown>)[k], (p.pages as unknown as Record<string, unknown>)[k])}>{ed(["pages", k], (w.pages as unknown as Record<string, unknown>)[k], (p.pages as unknown as Record<string, unknown>)[k])}</Item>)}</div>

      <SectionTitle n={2} label="Perfis ideológicos (abaixo de Seu perfil)" color="#6d3fc4" />
      <div className="space-y-2">{Object.keys(w.profiles).map((k) => <Item key={k} title={k} changed={diff(w.profiles[k], p.profiles[k])}>{ed(["profiles", k], w.profiles[k], p.profiles[k])}</Item>)}</div>

      <SectionTitle n={3} label="Botões das correntes na régua (o que é e quem são os representantes)" color="#ec4899" />
      <div className="space-y-2">
        <Item title="Entenda o espectro político (introdução)" changed={diff(w.spectrumIntro, p.spectrumIntro)}>{ed(["spectrumIntro"], w.spectrumIntro, p.spectrumIntro)}</Item>
        <Item title="Comparação prática (tabela)" changed={diff(w.spectrumComparison, p.spectrumComparison)}>{ed(["spectrumComparison"], w.spectrumComparison, p.spectrumComparison)}</Item>
        {SPECTRUM_TERMS.map((t) => {
          const si = w.spectrumSections.findIndex((x) => x.id === t.section);
          const sec = w.spectrumSections[si];
          const hKey = w.history[t.label] ? t.label : t.section;
          const shared = SPECTRUM_TERMS.filter((x) => x.section === t.section).length > 1;
          const changed = diff(sec, p.spectrumSections.find((x) => x.id === t.section)) || diff(w.history[hKey], p.history[hKey]);
          return (
            <Item key={t.label} title={t.label} hint={w.history[hKey]?.figures.map((f) => f.name).join(", ")} changed={changed}>
              <div className="space-y-4">
                {w.history[hKey] ? (
                  <div className="rounded-xl bg-[#fdf8ec] p-3 ring-1 ring-note-line">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gold-strong">Na história: personagens, capítulos e linha do tempo</p>
                    {ed(["history", hKey], w.history[hKey], p.history[hKey])}
                  </div>
                ) : null}
                {sec ? (
                  <div className="rounded-xl bg-paper/60 p-3 ring-1 ring-line">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-3">Explicação e links{shared ? ` (texto compartilhado: ${SPECTRUM_TERMS.filter((x) => x.section === t.section).map((x) => x.label).join(" e ")})` : ""}</p>
                    {ed(["spectrumSections", si], sec, p.spectrumSections.find((x) => x.id === t.section))}
                  </div>
                ) : null}
              </div>
            </Item>
          );
        })}
      </div>

      <SectionTitle n={4} label="“Entender por quê” do relatório (Visão Lula e Visão Flávio, tema a tema)" color="#2f9a5d" />
      <div className="space-y-2">{w.candidateViews.map((v, i) => <Item key={v.candidateId} title={`Entender por quê · Visão ${v.candidateId === "lula" ? "Lula" : "Flávio"}`} hint="o texto de cada tema que abre ao tocar em uma área do relatório" changed={diff(v, p.candidateViews[i])}>{ed(["candidateViews", i], v, p.candidateViews[i])}</Item>)}</div>

      <SectionTitle n={5} label="Currículos dos candidatos" color="#1c1c1a" />
      <div className="space-y-2">{w.candidateProfiles.map((c, i) => <Item key={c.candidateId} title={c.candidateId === "lula" ? "Lula" : "Flávio Bolsonaro"} changed={diff(c, p.candidateProfiles[i])}>{ed(["candidateProfiles", i], c, p.candidateProfiles[i])}</Item>)}</div>
    </AdminShell>
  );
}
