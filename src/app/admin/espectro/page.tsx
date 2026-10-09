import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { QUESTIONS } from "@/data/questions";
import { TOPICS } from "@/data/topics";
import { AREA_GROUPS } from "@/components/report/areaGroups";
import { QUESTION_NUMBER } from "@/lib/question-order";
import { spectrumPositionOf } from "@/data/spectrum-positions";
import { SPECTRUM_BANDS } from "@/data/political-spectrum";
import { AdminHero, AdminShell, Kpi, Panel, QNum, SectionTitle } from "@/components/admin/AdminUI";

export const metadata: Metadata = { title: "Espectro político", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const bandIndex = (label: string) => SPECTRUM_BANDS.findIndex((b) => b.label === label);

/** Para qual faixa da régua cada alternativa leva a pessoa (independe dos candidatos). */
export default async function AdminSpectrumPage() {
  if (!(await isAdminSession())) redirect("/admin/login");
  let reviewed = 0, cells = 0;
  const perBand = SPECTRUM_BANDS.map(() => 0);

  const sections = AREA_GROUPS.map((g, gi) => {
    const topics = TOPICS.filter((t) => g.topicIds.includes(t.id)).sort((a, b) => a.order - b.order);
    const rows = topics.flatMap((t) => QUESTIONS.filter((q) => q.topicId === t.id).sort((a, b) => a.order - b.order).map((q) => ({
      q, t,
      options: q.options.filter((o) => !o.isNoOpinion).map((o) => {
        const v = spectrumPositionOf(q.id, o.id);
        if (v) { cells++; perBand[bandIndex(v.band)]++; if (v.reason !== "Proposta") reviewed++; }
        return { o, v };
      }),
    })));
    return { g, gi, rows };
  });
  const maxBand = Math.max(...perBand, 1);

  return (
    <AdminShell current="/admin/espectro">
      <AdminHero kicker="Régua do relatório" title="Espectro político" pdfTitle="Espectro político"
        subtitle="Para qual faixa da régua cada alternativa leva a pessoa. A posição dela é a média do meio das faixas que marcou; não depende dos candidatos. Mudou aqui, mudou na régua." />

      <section className="grid gap-3 sm:grid-cols-3">
        <Kpi label="Alternativas com faixa" value={String(cells)} note={`em ${QUESTIONS.length} perguntas`} color="#6d3fc4" />
        <Kpi label="Revisadas por você" value={String(reviewed)} note="contorno roxo na tabela" color="#ec4899" />
        <Kpi label="Ainda proposta" value={String(cells - reviewed)} note="aguardando sua revisão" color="#d4a017" />
      </section>

      <Panel title="Para onde as alternativas apontam" subtitle="Quantas alternativas em cada faixa da régua">
        <div className="flex h-36 items-end gap-2" role="img" aria-label={SPECTRUM_BANDS.map((b, i) => `${b.label}: ${perBand[i]}`).join("; ")}>
          {SPECTRUM_BANDS.map((b, i) => (
            <div key={b.label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
              <span className="text-xs font-semibold tabular-nums text-ink-2">{perBand[i]}</span>
              <div className="w-full rounded-t-md" style={{ height: `${(perBand[i] / maxBand) * 100}%`, minHeight: 3, background: b.color }} />
            </div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-8 gap-2 text-center text-[11px] leading-tight text-ink-3">{SPECTRUM_BANDS.map((b) => <span key={b.label}>{b.label}</span>)}</div>
      </Panel>

      {sections.map(({ g, gi, rows }) => (
        <div key={g.id} className="space-y-3">
          <SectionTitle n={gi + 1} label={g.label} color={g.color} note={`${rows.length} perguntas`} />
          <div className="grid gap-4 xl:grid-cols-2">
            {rows.map(({ q, t, options }) => (
              <article key={q.id} className="overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-black/5">
                <div aria-hidden="true" className="h-1" style={{ background: g.color }} />
                <div className="p-4">
                  <p className="text-sm font-semibold leading-snug text-ink"><QNum n={QUESTION_NUMBER[q.id]} title={`código interno ${q.id}`} />{q.text}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-wide text-ink-3">{t.name}</p>
                  <ul className="mt-3 divide-y divide-line/70">
                    {options.map(({ o, v }) => {
                      const bi = v ? bandIndex(v.band) : -1;
                      return (
                        <li key={o.id} className="flex flex-wrap items-center gap-x-3 gap-y-1.5 py-2">
                          <span className="min-w-0 flex-1 text-[13px] font-medium leading-snug text-ink-2">{o.label}</span>
                          {v ? (
                            <span className="flex items-center gap-2" title={v.reason}>
                              <span aria-hidden="true" className="flex h-2 w-28 overflow-hidden rounded-full">
                                {SPECTRUM_BANDS.map((b, i) => <span key={b.label} className="h-full flex-1" style={{ background: i === bi ? b.color : "var(--color-line)" }} />)}
                              </span>
                              <span className={`w-32 rounded-full px-2.5 py-0.5 text-center text-xs font-bold text-ink ${v.reason !== "Proposta" ? "ring-2 ring-purple ring-offset-1" : ""}`} style={{ background: `${SPECTRUM_BANDS[bi].color}33` }}>{v.band}</span>
                            </span>
                          ) : <span className="text-xs italic text-ink-3">sem faixa (não entra na régua)</span>}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      ))}
    </AdminShell>
  );
}
