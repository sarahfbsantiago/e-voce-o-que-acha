import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { QUESTIONS } from "@/data/questions";
import { TOPICS } from "@/data/topics";
import { AREA_GROUPS } from "@/components/report/areaGroups";
import { QUESTION_NUMBER } from "@/lib/question-order";
import { spectrumPositionOf } from "@/data/spectrum-positions";
import { IDEOLOGY_RANGES, RIGHT_SIDE_FROM, SPECTRUM_BANDS, ideologySpot } from "@/data/political-spectrum";
import { AdminHero, Kpi, Panel, QNum, SectionTitle } from "@/components/admin/AdminUI";


const bandIndex = (label: string) => SPECTRUM_BANDS.findIndex((b) => b.label === label);

/** Para qual faixa da régua cada alternativa leva a pessoa (independe dos candidatos). */
export async function EspectroSection() {
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
    <>
      <AdminHero kicker="Análise geral · régua ideológica" title="Espectro político" pdfTitle="Espectro político"
        subtitle="Define a ideologia da pessoa na régua e de qual candidato ela fica mais perto ideologicamente: de comunismo a conservadorismo, Lula; de nacionalismo radical em diante, Flávio. É uma análise diferente da tema a tema (Notas por alternativa, as análises específicas)." />

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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

      <Panel title="Como a conta é feita: análise geral, na régua ideológica" subtitle="Posição da pessoa na régua, ideologia e de qual candidato ela fica mais perto ideologicamente. Não usa as notas por tema.">
        <div className="grid gap-4 text-sm leading-relaxed text-ink-2 lg:grid-cols-3">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-3">1. Valor de cada resposta</p>
            <p>Cada alternativa aponta para uma faixa. A resposta vale o meio dessa faixa (&quot;Não sei&quot; não entra):</p>
            <ul className="grid grid-cols-2 gap-1 text-xs">
              {SPECTRUM_BANDS.map((b, i) => (
                <li key={b.label} className="flex items-center gap-1.5"><span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: b.color }} /><span className="min-w-0 flex-1">{b.label}</span><b className="tabular-nums text-ink">{String(i + 0.5).replace(".", ",")}</b></li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-3">2. Média por resposta</p>
            <p><b className="text-ink">Posição</b> = soma dos valores das respostas ÷ número de respostas.</p>
            <div className="rounded-xl bg-paper/70 p-3 ring-1 ring-line">
              <p className="text-xs font-bold uppercase tracking-wide text-ink-3">Exemplo</p>
              <p className="mt-1">3 respostas: uma em Esquerda, uma em Centro e uma em Direita.</p>
              <p className="mt-2 font-mono text-[13px] text-ink">(1,5 + 3,5 + 5,5) ÷ 3 = 3,5</p>
              <p className="mt-1">3,5 → Centro político.</p>
            </div>
            <p className="text-xs">A ideologia é a corrente cujo trecho contém a posição:</p>
            <ul className="space-y-0.5 text-xs">
              {IDEOLOGY_RANGES.map((r, i) => (
                <li key={r.label} className="flex justify-between gap-2"><span>{r.label}</span><span className="tabular-nums text-ink-3">{i === 0 ? "até " : r.upTo === Infinity ? "acima de " : `${String(IDEOLOGY_RANGES[i - 1].upTo).replace(".", ",")} a `}{(r.upTo === Infinity ? IDEOLOGY_RANGES[i - 1].upTo : r.upTo).toString().replace(".", ",")}</span></li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-3">3. Mais perto de qual candidato</p>
            {(() => {
              const left = IDEOLOGY_RANGES.filter((r) => (ideologySpot(r.label) ?? 0) < RIGHT_SIDE_FROM).map((r) => r.label);
              const right = IDEOLOGY_RANGES.filter((r) => (ideologySpot(r.label) ?? 0) >= RIGHT_SIDE_FROM).map((r) => r.label);
              return (
                <>
                  <div className="rounded-xl p-3 ring-1 ring-[#6d3fc4]/30" style={{ background: "#6d3fc414" }}>
                    <p>De <b className="text-ink">{left[0]}</b> a <b className="text-ink">{left[left.length - 1]}</b>:</p>
                    <p className="mt-1 font-bold text-[#562f9f]">mais próxima da ideologia de Luiz Inácio Lula da Silva</p>
                  </div>
                  <div className="rounded-xl p-3 ring-1 ring-[#2f9a5d]/30" style={{ background: "#2f9a5d14" }}>
                    <p>De <b className="text-ink">{right[0]}</b> em diante ({right.join(", ")}):</p>
                    <p className="mt-1 font-bold text-[#237a49]">mais próxima da ideologia de Flávio Nantes Bolsonaro</p>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </Panel>

      {sections.map(({ g, gi, rows }) => (
        <div key={g.id} className="space-y-3">
          <SectionTitle n={gi + 1} label={g.label} color={g.color} note={`${rows.length} perguntas`} />
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 md:mx-0 md:grid md:overflow-visible md:px-0 md:pb-0 print:mx-0 print:grid print:overflow-visible print:px-0 xl:grid-cols-2">
            {rows.map(({ q, t, options }) => (
              <article key={q.id} className="w-[86%] shrink-0 snap-start md:w-auto md:shrink print:w-auto min-w-0 overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-black/5 print:break-inside-avoid print:border print:border-line">
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
    </>
  );
}
