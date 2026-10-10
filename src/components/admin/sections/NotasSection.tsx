import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { getContentRepository } from "@/lib/repository";
import { QUESTIONS } from "@/data/questions";
import { TOPICS } from "@/data/topics";
import { AREA_GROUPS } from "@/components/report/areaGroups";
import { currentOptionScore, proposedOptionScore } from "@/lib/option-scores";
import { QUESTION_NUMBER } from "@/lib/question-order";
import { ensureLiveConfig } from "@/lib/live-config-server";
import { AdminHero, Kpi, Panel, QNum, SectionTitle } from "@/components/admin/AdminUI";


const CANDS = [{ id: "lula", name: "Lula", color: "#6d3fc4" }, { id: "flavio-bolsonaro", name: "Flávio", color: "#2f9a5d" }];
const fmt = (n: number) => (n === 1 ? "1" : n === 0.5 ? "0,5" : "0");
/** Cor da nota: 1 verde cheio, 0,5 amarelo, 0 cinza. */
const PILL: Record<string, string> = {
  "1": "bg-mint text-white",
  "0,5": "bg-gold text-[#3d2f05]",
  "0": "bg-line text-ink-3",
};

/** Notas por alternativa: a mesma tabela usada na conta do relatório. */
export async function NotasSection() {
  await ensureLiveConfig();
  if (!(await isAdminSession())) redirect("/admin/login");
  const positions = await (await getContentRepository()).getPublishedPositions();

  let changed = 0, cells = 0;
  const tally = { "1": 0, "0,5": 0, "0": 0 } as Record<string, number>;
  const sections = AREA_GROUPS.map((g, gi) => {
    const topics = TOPICS.filter((t) => g.topicIds.includes(t.id)).sort((a, b) => a.order - b.order);
    const questions = topics.flatMap((t) => QUESTIONS.filter((q) => q.topicId === t.id).sort((a, b) => a.order - b.order).map((q) => ({ q, t })));
    const rows = questions.map(({ q, t }) => ({
      q, t,
      options: q.options.filter((o) => !o.isNoOpinion).map((o) => ({
        o,
        scores: CANDS.map((c) => {
          const raw = currentOptionScore(q, o, positions.find((p) => p.candidateId === c.id && p.questionId === q.id));
          const prop = proposedOptionScore(q.id, c.id, o.id);
          const hasAny = q.options.some((x) => proposedOptionScore(q.id, c.id, x.id));
          if (raw === null && !hasAny) return { value: null as string | null, reviewed: false, title: "sem posição" };
          const now = raw ?? 0;
          const value = fmt(prop ? prop.score : now);
          const reviewed = !!prop && prop.score !== now;
          cells++; tally[value]++; if (reviewed) changed++;
          return { value, reviewed, title: reviewed ? `Regra padrão: ${raw === null ? "sem posição" : fmt(now)}. ${prop!.reason}` : "Regra padrão" };
        }),
      })),
    }));
    return { g, gi, rows };
  });

  return (
    <>
      <AdminHero kicker="Análise específica · tema a tema" title="Notas por alternativa" pdfTitle="Notas por alternativa"
        subtitle="Define só o bloco 'Qual candidato está mais próximo do seu perfil' do relatório: em cada tema, Lula, Flávio ou equivalente. É uma análise diferente da régua ideológica (Espectro político, a análise geral)." />

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        <Kpi label="Perguntas" value={String(QUESTIONS.length)} note="no questionário" color="#6d3fc4" />
        <Kpi label="Notas na tabela" value={String(cells)} note="alternativas × candidatos" color="#2563eb" />
        <Kpi label="Revisadas por você" value={String(changed)} note="diferentes da regra padrão" color="#ec4899" />
        <Kpi label="Nota 1" value={String(tally["1"])} note="o candidato defende" color="#2f9a5d" />
        <Kpi label="Nota 0,5" value={String(tally["0,5"])} note="defende em parte" color="#d4a017" />
      </section>

      <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-surface p-3 text-xs shadow-sm ring-1 ring-black/5">
        <span className="font-semibold text-ink-2">Legenda:</span>
        <span className={`rounded-full px-2.5 py-0.5 font-bold ${PILL["1"]}`}>1 defende</span>
        <span className={`rounded-full px-2.5 py-0.5 font-bold ${PILL["0,5"]}`}>0,5 em parte</span>
        <span className={`rounded-full px-2.5 py-0.5 font-bold ${PILL["0"]}`}>0 não defende</span>
        <span className="rounded-full px-2.5 py-0.5 font-bold ring-2 ring-purple">contorno roxo = revisada por você</span>
        <span className="ml-auto text-ink-3">Por tema: soma das notas ÷ perguntas respondidas (&quot;Não sei&quot; não entra). Ex.: 2 perguntas com notas 1 e 0,5 → (1 + 0,5) ÷ 2 = <b className="text-ink">0,75</b>.</span>
      </div>

      <Panel title="Como a conta é feita: análise específica, tema a tema" subtitle="Só esta conta define o bloco 'Qual candidato está mais próximo do seu perfil' do relatório. Não mexe na régua ideológica.">
        {(() => {
          // exemplo com as notas reais da tabela: tema Economia e impostos, 2 perguntas
          const q1 = QUESTIONS.find((q) => q.id === "q01")!;
          const q2 = QUESTIONS.find((q) => q.id === "q03")!;
          const picks = [{ q: q1, o: q1.options[0] }, { q: q2, o: q2.options[1] }];
          const val = (qid: string, cid: string, oid: string) => proposedOptionScore(qid, cid, oid)?.score ?? 0;
          const rows = picks.map(({ q, o }) => ({ q, o, s: CANDS.map((c) => val(q.id, c.id, o.id)) }));
          const avg = CANDS.map((_, i) => rows.reduce((n, r) => n + r.s[i], 0) / rows.length);
          const top = avg[0] === avg[1] ? null : avg[0] > avg[1] ? 0 : 1;
          const f = (n: number) => String(Math.round(n * 100) / 100).replace(".", ",");
          return (
            <div className="space-y-6">
              <ol className="grid gap-3 md:grid-cols-3">
                {[
                  ["1", "Cada resposta dá a cada candidato a nota da alternativa marcada (1, 0,5 ou 0)"],
                  ["2", "Média do tema = soma das notas ÷ perguntas respondidas no tema"],
                  ["3", "Quem tem a média maior fica com o tema; empate = equivalente"],
                ].map(([n, t]) => (
                  <li key={n} className="flex items-center gap-3 rounded-xl bg-paper/70 p-3 ring-1 ring-line">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-purple to-[#2563eb] text-base font-bold text-white">{n}</span>
                    <span className="text-sm font-semibold leading-snug text-ink">{t}</span>
                  </li>
                ))}
              </ol>

              <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
                {/* exemplo */}
                <div className="rounded-xl bg-paper/70 p-4 ring-1 ring-line">
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-3">Exemplo · tema Economia e impostos, 2 respostas</p>
                  <ul className="mt-3 space-y-2">
                    {rows.map((r, i) => (
                      <li key={r.q.id} className="rounded-lg bg-surface p-3 ring-1 ring-line">
                        <p className="text-xs text-ink-2"><QNum n={QUESTION_NUMBER[r.q.id]} />{r.q.text}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                          <span className="rounded-full bg-ink px-2.5 py-0.5 font-semibold text-white">marcou: {r.o.label}</span>
                          <span className="text-ink-3">→</span>
                          {CANDS.map((c, ci) => (
                            <span key={c.id} className="inline-flex items-center gap-1"><span className="font-semibold" style={{ color: c.color }}>{c.name}</span><span className={`inline-grid h-6 min-w-9 place-items-center rounded-full px-2 font-bold ${PILL[fmt(r.s[ci])]}`}>{fmt(r.s[ci])}</span></span>
                          ))}
                          <span className="ml-auto text-[10px] font-bold text-ink-3">resposta {i + 1}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 space-y-2">
                    {CANDS.map((c, ci) => (
                      <div key={c.id} className="flex items-center gap-2 text-sm">
                        <span className="w-14 font-bold" style={{ color: c.color }}>{c.name}</span>
                        <span className="font-mono text-[13px] text-ink">({rows.map((r) => f(r.s[ci])).join(" + ")}) ÷ {rows.length} =</span>
                        <span className="relative h-3 flex-1 overflow-hidden rounded-full bg-line"><span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${avg[ci] * 100}%`, background: c.color }} /></span>
                        <b className="w-10 text-right tabular-nums text-ink">{f(avg[ci])}</b>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 rounded-lg bg-surface px-3 py-2 text-sm font-semibold text-ink ring-1 ring-line">
                    Resultado do tema: {top === null ? "equivalente" : <span style={{ color: CANDS[top].color }}>{CANDS[top].name}</span>} <span className="font-normal text-ink-3">(média maior)</span>
                  </p>
                </div>

                {/* onde aparece no relatório */}
                <div className="rounded-xl p-4 ring-2 ring-purple/40" style={{ background: "#6d3fc40a" }}>
                  <p className="text-xs font-bold uppercase tracking-wide text-purple-strong">Onde isso aparece no relatório da pessoa</p>
                  <div className="mt-3 rounded-xl bg-surface p-3 shadow-sm ring-1 ring-line">
                    <p className="text-sm font-bold text-ink">Qual candidato está mais próximo do seu perfil</p>
                    <div className="relative mt-2 grid grid-cols-2 gap-2">
                      {CANDS.map((c, ci) => (
                        <div key={c.id} className="rounded-lg bg-paper/70 p-2 ring-1 ring-line">
                          <p className="text-[10px] uppercase tracking-wide text-ink-3">{c.name}</p>
                          <p className="text-xl font-bold text-accent">{top === ci ? 1 : 0}<span className="ml-1 text-[11px] font-medium text-ink-2">de 1 tema</span></p>
                        </div>
                      ))}
                      <span className="absolute -right-2 -top-3 grid h-6 w-6 place-items-center rounded-full bg-[#ec4899] text-xs font-bold text-white shadow">B</span>
                    </div>
                    <div className="relative mt-2 rounded-lg bg-paper/70 p-2 ring-1 ring-line">
                      <p className="text-xs font-bold text-ink">Economia e trabalho</p>
                      <p className="mt-1 flex items-center justify-between text-xs text-ink-2">Economia e impostos
                        <span className="rounded-md border border-accent/30 bg-accent-soft px-1.5 py-0.5 text-[11px] font-medium text-accent-strong ring-2 ring-[#2563eb]">{top === null ? "equivalente" : CANDS[top].name}</span>
                      </p>
                      <span className="absolute -right-2 -top-3 grid h-6 w-6 place-items-center rounded-full bg-[#2563eb] text-xs font-bold text-white shadow">A</span>
                    </div>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-ink-2">
                    <li className="flex gap-2"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#2563eb] text-xs font-bold text-white">A</span><span>O <b className="text-ink">selo de cada tema</b> mostra quem teve a média maior naquele tema (o resultado do exemplo).</span></li>
                    <li className="flex gap-2"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#ec4899] text-xs font-bold text-white">B</span><span>Os <b className="text-ink">números no topo</b> contam em quantos temas cada candidato ficou mais perto.</span></li>
                  </ul>
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
                  <table className="mt-3 w-full text-sm">
                    <thead>
                      <tr className="text-left text-[11px] uppercase tracking-wide text-ink-3">
                        <th className="pb-2 font-semibold">Alternativa</th>
                        {CANDS.map((c) => (
                          <th key={c.id} className="w-20 pb-2 text-center font-semibold"><span className="inline-flex items-center gap-1"><span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: c.color }} />{c.name}</span></th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {options.map(({ o, scores }) => (
                        <tr key={o.id} className="border-t border-line/70">
                          <th scope="row" className="py-2 pr-2 text-left text-[13px] font-medium leading-snug text-ink-2">{o.label}</th>
                          {scores.map((sc, i) => (
                            <td key={CANDS[i].id} className="py-2 text-center">
                              {sc.value === null ? (
                                <span className="text-[11px] italic text-ink-3">sem posição</span>
                              ) : (
                                <span title={sc.title} className={`inline-grid h-7 min-w-10 place-items-center rounded-full px-2 text-xs font-bold tabular-nums ${PILL[sc.value]} ${sc.reviewed ? "ring-2 ring-purple ring-offset-1" : ""}`}>{sc.value}</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
