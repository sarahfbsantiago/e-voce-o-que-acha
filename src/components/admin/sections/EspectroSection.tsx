import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { QUESTIONS } from "@/data/questions";
import { TOPICS } from "@/data/topics";
import { AREA_GROUPS } from "@/components/report/areaGroups";
import { QUESTION_NUMBER } from "@/lib/question-order";
import { spectrumPositionOf } from "@/data/spectrum-positions";
import { CANDIDATE_SPECTRUM, IDEOLOGY_RANGES, RULER_RULES, RULER_WIDTHS, SPECTRUM_BANDS, ideologySpot, rulerPct } from "@/data/political-spectrum";
import { ensureLiveConfig } from "@/lib/live-config-server";
import { AdminHero, Kpi, Panel, QNum, SectionTitle } from "@/components/admin/AdminUI";


const bandIndex = (label: string) => SPECTRUM_BANDS.findIndex((b) => b.label === label);

/** Para qual faixa da régua cada alternativa leva a pessoa (independe dos candidatos). */
export async function EspectroSection() {
  await ensureLiveConfig();
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

      <Panel title="Como a conta é feita: análise geral, na régua ideológica" subtitle="Não usa as notas por tema.">
        {(() => {
          const ex = [{ band: 1, v: "1,5" }, { band: 3, v: "3,5" }, { band: 5, v: "5,5" }];
          const split = rulerPct(RULER_RULES.rightSideFrom);
          const segs = IDEOLOGY_RANGES.map((r, i) => {
            const from = i === 0 ? 0 : IDEOLOGY_RANGES[i - 1].upTo;
            const to = Math.min(r.upTo, SPECTRUM_BANDS.length);
            const spot = ideologySpot(r.label) ?? from;
            return { n: i + 1, label: r.label, left: rulerPct(from), width: rulerPct(to) - rulerPct(from), color: SPECTRUM_BANDS[Math.min(SPECTRUM_BANDS.length - 1, Math.floor(spot))].color, lula: spot < RULER_RULES.rightSideFrom };
          });
          return (
            <div className="space-y-6">
              {/* passos */}
              <ol className="grid gap-3 md:grid-cols-3">
                {[
                  ["1", "Cada resposta vale o meio da faixa para onde aponta"],
                  ["2", "Posição = média dos valores das respostas"],
                  ["3", "A posição cai numa ideologia e num lado da régua"],
                ].map(([n, t]) => (
                  <li key={n} className="flex items-center gap-3 rounded-xl bg-paper/70 p-3 ring-1 ring-line">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-purple to-[#2563eb] text-base font-bold text-white">{n}</span>
                    <span className="text-sm font-semibold leading-snug text-ink">{t}</span>
                  </li>
                ))}
              </ol>

              {/* régua visual */}
              <div className="overflow-x-auto pb-1">
                <div className="min-w-[640px] px-1">
                  {/* lados: Lula x Flávio */}
                  <div className="relative h-9">
                    <div className="absolute inset-y-0 left-0 flex items-center justify-center rounded-l-xl bg-[#6d3fc4]/12 text-xs font-bold text-[#562f9f] ring-1 ring-[#6d3fc4]/25" style={{ width: `${split}%` }}>◀ mais perto de Lula</div>
                    <div className="absolute inset-y-0 right-0 flex items-center justify-center rounded-r-xl bg-[#2f9a5d]/12 text-xs font-bold text-[#237a49] ring-1 ring-[#2f9a5d]/25" style={{ width: `${100 - split}%` }}>mais perto de Flávio ▶</div>
                  </div>
                  {/* candidatos */}
                  <div className="relative mt-1 h-7">
                    {Object.entries(CANDIDATE_SPECTRUM).map(([id, c]) => (
                      <span key={id} className={`absolute top-0 -translate-x-1/2 rounded-md px-1.5 py-0.5 text-[11px] font-bold text-white ${id === "lula" ? "bg-[#6d3fc4]" : "bg-[#2f9a5d]"}`} style={{ left: `${rulerPct(c.at)}%` }}>{id === "lula" ? "Lula" : "Flávio"}</span>
                    ))}
                  </div>
                  {/* faixas com valor */}
                  <div className="relative">
                    <div className="flex h-8 overflow-hidden rounded-lg">
                      {SPECTRUM_BANDS.map((b, i) => (
                        <div key={b.label} className="flex items-center justify-center text-[11px] font-bold text-white" style={{ background: b.color, flexGrow: RULER_WIDTHS[i], flexBasis: 0 }}>{String(i + 0.5).replace(".", ",")}</div>
                      ))}
                    </div>
                    <div aria-hidden="true" className="absolute -top-16 -bottom-14 w-0.5 bg-ink" style={{ left: `${split}%` }} />
                  </div>
                  <div className="mt-1 flex text-center text-[10px] leading-tight text-ink-3">
                    {SPECTRUM_BANDS.map((b, i) => <span key={b.label} style={{ flexGrow: RULER_WIDTHS[i], flexBasis: 0 }}>{b.label}</span>)}
                  </div>
                  {/* trechos das ideologias */}
                  <div className="relative mt-3 h-7">
                    {segs.map((g) => (
                      <div key={g.label} title={g.label} className="absolute inset-y-0 flex items-center justify-center border-r-2 border-surface text-[11px] font-bold text-white" style={{ left: `${g.left}%`, width: `${g.width}%`, background: g.color }}>{g.n}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* legenda das ideologias */}
              <div className="grid gap-3 md:grid-cols-2">
                {[true, false].map((lula) => (
                  <div key={String(lula)} className="rounded-xl p-3 ring-1" style={{ background: lula ? "#6d3fc40f" : "#2f9a5d0f", borderColor: "transparent", boxShadow: `inset 0 0 0 1px ${lula ? "#6d3fc440" : "#2f9a5d40"}` }}>
                    <p className={`text-xs font-bold uppercase tracking-wide ${lula ? "text-[#562f9f]" : "text-[#237a49]"}`}>{lula ? "Mais perto da ideologia de Luiz Inácio Lula da Silva" : "Mais perto da ideologia de Flávio Nantes Bolsonaro"}</p>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {segs.filter((g) => g.lula === lula).map((g) => (
                        <li key={g.label} className="inline-flex items-center gap-1.5 rounded-full bg-surface py-0.5 pl-0.5 pr-2.5 text-xs font-semibold text-ink ring-1 ring-line">
                          <span className="grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold text-white" style={{ background: g.color }}>{g.n}</span>{g.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* exemplo visual */}
              <div className="rounded-xl bg-paper/70 p-4 ring-1 ring-line">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-3">Exemplo · 3 respostas</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-lg font-bold text-ink">
                  <span className="text-ink-3">(</span>
                  {ex.map((e, i) => (
                    <span key={e.band} className="flex items-center gap-2">
                      {i ? <span className="text-ink-3">+</span> : null}
                      <span className="flex flex-col items-center rounded-lg px-3 py-1 text-white" style={{ background: SPECTRUM_BANDS[e.band].color }}>
                        <span className="tabular-nums">{e.v}</span><span className="text-[10px] font-semibold opacity-90">{SPECTRUM_BANDS[e.band].label}</span>
                      </span>
                    </span>
                  ))}
                  <span className="text-ink-3">) ÷ 3 =</span>
                  <span className="flex flex-col items-center rounded-lg px-3 py-1 text-white" style={{ background: SPECTRUM_BANDS[3].color }}>
                    <span className="tabular-nums">3,5</span><span className="text-[10px] font-semibold opacity-90">Centro político</span>
                  </span>
                  <span className="text-ink-3">→</span>
                  <span className="rounded-lg bg-[#6d3fc4] px-3 py-1.5 text-sm text-white">mais perto de Lula</span>
                </div>
              </div>
            </div>
          );
        })()}
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
