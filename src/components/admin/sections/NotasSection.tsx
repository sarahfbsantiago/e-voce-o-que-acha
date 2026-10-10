import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { getContentRepository } from "@/lib/repository";
import { QUESTIONS } from "@/data/questions";
import { TOPICS } from "@/data/topics";
import { AREA_GROUPS } from "@/components/report/areaGroups";
import { currentOptionScore, proposedOptionScore } from "@/lib/option-scores";
import { QUESTION_NUMBER } from "@/lib/question-order";
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
      <AdminHero kicker="Calculadora" title="Notas por alternativa" pdfTitle="Notas por alternativa"
        subtitle="Quanto cada candidato ganha quando a pessoa marca cada alternativa. É a tabela usada na conta do relatório: mudou aqui, mudou na calculadora." />

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        <Kpi label="Perguntas" value={String(QUESTIONS.length)} note="5 por seção" color="#6d3fc4" />
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
        <span className="ml-auto text-ink-3">Por tema: soma das notas ÷ perguntas respondidas. &quot;Não sei&quot; não entra.</span>
      </div>

      <Panel title="Como a conta é feita" subtitle="Média por resposta, tema a tema">
        <div className="grid gap-4 text-sm leading-relaxed text-ink-2 md:grid-cols-2">
          <ol className="list-decimal space-y-1.5 pl-5">
            <li>Para cada pergunta respondida, cada candidato ganha a nota da alternativa que a pessoa marcou: <b className="text-ink">1</b>, <b className="text-ink">0,5</b> ou <b className="text-ink">0</b>. &quot;Não sei&quot; não entra.</li>
            <li><b className="text-ink">Média do tema</b> = soma das notas do candidato ÷ número de perguntas respondidas no tema.</li>
            <li>Fica mais perto no tema quem tiver a média maior; médias iguais = equivalente.</li>
          </ol>
          <div className="rounded-xl bg-paper/70 p-3 ring-1 ring-line">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-3">Exemplo</p>
            <p className="mt-1">Tema com 2 perguntas respondidas. Na 1ª, a alternativa marcada vale 1 para A e 0 para B; na 2ª, vale 1 para A e 0,5 para B.</p>
            <p className="mt-2 font-mono text-[13px] text-ink">A: (1 + 1) ÷ 2 = 1<br />B: (0 + 0,5) ÷ 2 = 0,25</p>
            <p className="mt-1">No tema, a pessoa fica mais perto de A.</p>
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
