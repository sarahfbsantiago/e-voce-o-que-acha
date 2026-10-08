import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageTitle } from "@/components/ui";
import { isAdminSession } from "@/lib/admin-auth";
import { getContentRepository, getStatsRepository } from "@/lib/repository";
import { aggregateProfileProximity } from "@/domain/profile-proximity";
import { QUESTIONS } from "@/data/questions";
import { QUESTION_NUMBER } from "@/lib/question-order";
import { buildResearchReport } from "@/lib/research-report";
import { INSUFFICIENT_DATA_MESSAGE } from "@/domain/aggregates";
import { AGE_RANGES, REGIONS } from "@/domain/types";
import { formatShare } from "@/domain/aggregates";
import { logoutAction } from "../login/actions";
import { AdminNav } from "@/components/AdminNav";
import { PrintButton } from "@/components/PrintButton";

export const metadata: Metadata = { title: "Dados da pesquisa", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminResearchPage() {
  if (!(await isAdminSession())) redirect("/admin/login");
  const stats = await getStatsRepository();

  if (!stats.enabled) {
    return (
      <div className="container-page py-12 max-w-3xl">
        <PageTitle>Dados da pesquisa</PageTitle>
        <p className="card p-4 text-sm">Estatísticas indisponíveis: banco de dados não configurado (modo estático). Defina <code>DATABASE_URL</code>, rode as migrações e o seed.</p>
      </div>
    );
  }

  const content = await getContentRepository();
  const [submissions, feedback, candidates, positions] = await Promise.all([stats.listSubmissions(), stats.listFeedback(), content.getCandidates(), content.getPublishedPositions()]);
  const pp = aggregateProfileProximity(submissions, QUESTIONS, candidates, positions);
  const r = buildResearchReport(submissions, feedback, pp);
  const candidateName = Object.fromEntries(candidates.map((c) => [c.id, c.name]));
  const ageLabel = Object.fromEntries(AGE_RANGES.map((a) => [a.value, a.label]));
  const regionLabel = Object.fromEntries(REGIONS.map((a) => [a.value, a.label]));

  return (
    <div className="container-page py-12 space-y-10">
      <AdminNav current="/admin/research" />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageTitle lead="Somente agregações. Nenhum registro individual é exibido.">Dados da pesquisa</PageTitle>
        <div className="flex flex-wrap items-center gap-2 print:hidden"><PrintButton label="Exportar PDF" fileTitle="Dados da pesquisa" /><form action={logoutAction}><button className="rounded-lg border border-line px-3 py-2 text-sm min-h-11">Sair</button></form></div>
      </div>

      <p className="hidden print:block text-xs text-ink-3">Gerado em {new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })} · Menos Pior · somente agregações</p>
      <p className="rounded-xl border border-note-line bg-note px-4 py-3 text-sm font-medium">{r.disclaimer}</p>

      <nav aria-label="Seções" className="card p-3 text-sm flex flex-wrap gap-x-4 gap-y-1">
        {[["#visao", "Visão geral"], ["#temas", "Temas"], ["#perguntas", "Perguntas"], ["#prioridades", "Prioridades"], ["#perfil", "Perfil mais próximo"], ["#tempo", "Evolução temporal"], ["#demografia", "Demografia opcional"], ["#avaliacao", "Avaliação da pesquisa"], ["#exportacao", "Exportação"]].map(([h, l]) => <a key={h} href={h} className="underline underline-offset-4">{l}</a>)}
      </nav>

      <section id="visao" className="grid gap-3 sm:grid-cols-3">
        <div className="card p-4"><p className="text-xs text-ink-3">Questionários recebidos</p><p className="text-3xl font-bold">{r.overview.totalSubmissions.toLocaleString("pt-BR")}</p><p className="text-xs text-ink-3">respostas</p></div>
        <div className="card p-4"><p className="text-xs text-ink-3">Com todas as perguntas respondidas</p><p className="text-3xl font-bold">{r.overview.completedAllQuestions.toLocaleString("pt-BR")}</p></div>
        <div className="card p-4"><p className="text-xs text-ink-3">Taxa de conclusão</p><p className="text-3xl font-bold">{r.overview.completionRate === null ? "—" : `${r.overview.completionRate}%`}</p><p className="text-xs text-ink-3">das respostas</p></div>
      </section>

      <section aria-label="Destaques" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {pp.byCandidate.map((b, i) => (
          <StatCard key={b.candidateId} tone={i === 0 ? "border-t-accent" : "border-t-mint"} label={`Perfil mais perto de ${candidateName[b.candidateId] ?? b.candidateId}`} value={b.count.toLocaleString("pt-BR")} note={b.share === null ? "sem comparação ainda" : `${b.share.toLocaleString("pt-BR")}% dos questionários comparáveis`} />
        ))}
        <StatCard tone="border-t-gold" label="Disseram que ajudou na decisão" value={r.feedback.shareHelpedYes === null ? "—" : `${r.feedback.shareHelpedYes}%`} note={`sim ${r.feedback.helpedYes} · não ${r.feedback.helpedNo}`} />
        <StatCard tone="border-t-purple" label="Nota média da pesquisa (1–5)" value={r.feedback.averageRating === null ? "—" : String(r.feedback.averageRating)} note={`${r.feedback.total} avaliações`} />
      </section>

      <section id="temas" aria-labelledby="temas-h">
        <h2 id="temas-h" className="text-xl font-bold">Temas e prioridades</h2>
        <table className="mt-3 w-full text-sm card">
          <thead><tr className="bg-paper text-left"><th className="p-2">Tema</th><th className="p-2">Respostas</th><th className="p-2">Muito importante ou prioridade máxima</th><th className="p-2">Distribuição (0→4)</th></tr></thead>
          <tbody>
            {r.priorities.map((p) => (
              <tr key={p.topicId} className="border-t border-line">
                <td className="p-2">{p.topicName}</td>
                <td className="p-2">{p.totalResponses}</td>
                <td className="p-2 min-w-48">
                  {p.totalResponses ? (
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-line" aria-hidden="true"><div className="h-full rounded-full bg-purple" style={{ width: `${p.shareHighPriority}%` }} /></div>
                      <span className="tabular-nums text-xs">{p.shareHighPriority.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%</span>
                    </div>
                  ) : "—"}
                </td>
                <td className="p-2 tabular-nums text-ink-2">{p.byLevel.join(" · ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="perguntas" aria-labelledby="perguntas-h" className="space-y-3">
        <h2 id="perguntas-h" className="text-xl font-bold">Perguntas</h2>
        <p className="text-sm text-ink-2">Quantas pessoas escolheram cada alternativa. Clique numa pergunta para ver as barras.</p>
        <div className="card p-4">
          <h3 className="text-sm font-semibold">Perguntas com mais “não sei”</h3>
          <p className="text-xs text-ink-3">Pode indicar pergunta confusa ou tema pouco conhecido.</p>
          <ul className="mt-3 space-y-2">
            {[...r.questions].filter((q) => q.totalResponses > 0).sort((a, b) => b.noOpinionCount / b.totalResponses - a.noOpinionCount / a.totalResponses).slice(0, 5).map((q) => (
              <BarRow key={q.questionId} tone="bg-gold" label={`Pergunta ${QUESTION_NUMBER[q.questionId]} — ${q.text}`} count={q.noOpinionCount} share={(q.noOpinionCount / q.totalResponses) * 100} />
            ))}
            {r.questions.every((q) => q.totalResponses === 0) ? <li className="text-sm text-ink-3">Sem dados.</li> : null}
          </ul>
        </div>
        {[...r.questions].sort((a, b) => QUESTION_NUMBER[a.questionId] - QUESTION_NUMBER[b.questionId]).map((q) => (
          <details key={q.questionId} className="card p-4">
            <summary className="text-sm font-medium" title={`código interno ${q.questionId}`}>Pergunta {QUESTION_NUMBER[q.questionId]} — {q.text} <span className="text-ink-3">({q.totalResponses} respostas · {q.noOpinionCount} “não sei”)</span></summary>
            {q.example ? <p className="mt-2 text-xs leading-relaxed text-ink-2">{q.example}</p> : null}
            <ul className="mt-3 space-y-2">
              {q.options.map((o) => (
                <BarRow key={o.optionId} label={o.label} count={o.count} share={q.totalResponses ? o.shareOfResponses : null} tone={o.label === "Não sei" ? "bg-ink-3" : "bg-accent"} />
              ))}
            </ul>
          </details>
        ))}
      </section>

      <section id="prioridades" aria-labelledby="prio-h">
        <h2 id="prio-h" className="text-xl font-bold">Prioridades mais escolhidas</h2>
        <ol className="mt-3 card p-4 text-sm list-decimal pl-6 space-y-1">
          {[...r.priorities].sort((a, b) => b.shareHighPriority - a.shareHighPriority).slice(0, 5).map((p) => <li key={p.topicId}>{p.topicName} — {p.totalResponses ? formatShare(p.shareHighPriority) : "—"} marcaram muito importante ou prioridade máxima</li>)}
        </ol>
      </section>

      <section id="perfil" aria-labelledby="perfil-h">
        <h2 id="perfil-h" className="text-xl font-bold">Perfil mais próximo</h2>
        <p className="mt-1 text-sm text-ink-2 max-w-3xl">Para cada questionário enviado, a mesma conta aberta do relatório: por tema, quem ficou mais perto (iguais = 1, parecidas = 0,5, silêncio conta como diferente); depois, quem ficou mais perto em mais temas. Descreve concordância com documentos publicados, não intenção de voto. Calculado com as posições publicadas agora; se uma posição mudar, o número muda.</p>
        {pp.withComparison > 0 ? (
          <>
            <table className="mt-3 w-full max-w-2xl text-sm card"><thead><tr className="bg-paper text-left"><th className="p-2">Resultado do perfil</th><th className="p-2">Questionários</th><th className="p-2">Proporção</th><th className="p-2">Concordância média</th></tr></thead>
              <tbody>
                {pp.byCandidate.map((b) => (
                  <tr key={b.candidateId} className="border-t border-line">
                    <td className="p-2">Mais perto de {candidateName[b.candidateId] ?? b.candidateId}</td>
                    <td className="p-2 tabular-nums">{b.count}</td>
                    <td className="p-2 tabular-nums font-medium">{b.share === null ? "—" : `${b.share.toLocaleString("pt-BR")}%`}</td>
                    <td className="p-2 tabular-nums">{b.meanAgreement === null ? "—" : `${b.meanAgreement.toLocaleString("pt-BR")}%`}</td>
                  </tr>
                ))}
                <tr className="border-t border-line"><td className="p-2">Empate em temas</td><td className="p-2 tabular-nums">{pp.ties}</td><td className="p-2 tabular-nums">{`${(Math.round((pp.ties / pp.withComparison) * 1000) / 10).toLocaleString("pt-BR")}%`}</td><td className="p-2">—</td></tr>
                <tr className="border-t border-line text-ink-3"><td className="p-2">Sem comparação possível</td><td className="p-2 tabular-nums">{pp.noComparison}</td><td className="p-2" colSpan={2}>fora da proporção</td></tr>
              </tbody>
            </table>
            <div className="mt-3 max-w-2xl">
              <div className="flex h-4 w-full overflow-hidden rounded-full bg-line" role="img" aria-label={pp.byCandidate.map((b) => `${candidateName[b.candidateId] ?? b.candidateId}: ${b.count}`).join("; ")}>
                {pp.byCandidate.map((b, i) => b.count > 0 ? <span key={b.candidateId} className={`flex items-center justify-center text-[10px] font-semibold text-white ${i === 0 ? "bg-accent" : "bg-mint"}`} style={{ width: `${(b.count / pp.withComparison) * 100}%` }}>{Math.round((b.count / pp.withComparison) * 100)}%</span> : null)}
                {pp.ties > 0 ? <span className="flex items-center justify-center text-[10px] font-semibold text-ink-2 bg-paper" style={{ width: `${(pp.ties / pp.withComparison) * 100}%` }}>{Math.round((pp.ties / pp.withComparison) * 100)}%</span> : null}
              </div>
              <p className="mt-1 text-xs text-ink-3">Base: {pp.withComparison} de {pp.total} questionários enviados. Concordância média = média, entre os questionários, de (iguais + 0,5 × parecidas) ÷ perguntas respondidas.</p>
            </div>
          </>
        ) : <p className="mt-3 text-sm text-ink-3">Sem dados: nenhum questionário com tema comparável.</p>}
      </section>

      <section id="tempo" aria-labelledby="tempo-h">
        <h2 id="tempo-h" className="text-xl font-bold">Evolução temporal</h2>
        {r.timeline.length ? (
          <div className="mt-3 card p-4">
            <div className="flex h-40 items-end gap-1" role="img" aria-label={r.timeline.map((t) => `${t.date}: ${t.count}`).join("; ")}>
              {r.timeline.map((t) => {
                const max = Math.max(...r.timeline.map((x) => x.count), 1);
                return (
                  <div key={t.date} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1" title={`${t.date}: ${t.count}`}>
                    <span className="text-[10px] tabular-nums text-ink-2">{t.count}</span>
                    <div className="w-full rounded-t bg-mint" style={{ height: `${(t.count / max) * 100}%`, minHeight: 2 }} />
                  </div>
                );
              })}
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-ink-3"><span>{r.timeline[0].date}</span><span>{r.timeline[r.timeline.length - 1].date}</span></div>
          </div>
        ) : null}
        <table className="mt-3 w-full max-w-md text-sm card"><thead><tr className="bg-paper text-left"><th className="p-2">Dia</th><th className="p-2">Questionários</th></tr></thead>
          <tbody>{r.timeline.length === 0 ? <tr><td className="p-2 text-ink-3" colSpan={2}>Sem dados.</td></tr> : r.timeline.map((t) => <tr key={t.date} className="border-t border-line"><td className="p-2">{t.date}</td><td className="p-2 tabular-nums">{t.count}</td></tr>)}</tbody>
        </table>
      </section>

      <section id="demografia" aria-labelledby="demo-h" className="grid gap-4 md:grid-cols-2">
        <h2 id="demo-h" className="text-xl font-bold md:col-span-2">Demografia opcional</h2>
        <p className="text-sm text-ink-2 md:col-span-2">Grupos com menos de {r.minAggregateGroupSize} respostas aparecem como “{INSUFFICIENT_DATA_MESSAGE}”. Não há cruzamentos entre recortes.</p>
        {[["Faixa etária", r.demographics.ageRange, ageLabel], ["Região", r.demographics.region, regionLabel]].map(([title, dist, labels]) => (
          <div key={title as string} className="card p-4 text-sm">
            <h3 className="font-semibold">{title as string}</h3>
            <ul className="mt-2 space-y-1">
              {Object.keys(dist as Record<string, number | null>).length === 0 ? <li className="text-ink-3">Sem dados.</li> : Object.entries(dist as Record<string, number | null>).map(([k, v]) => <li key={k} className="flex justify-between gap-3"><span>{(labels as Record<string, string>)[k] ?? k}</span><span className="tabular-nums">{v === null ? INSUFFICIENT_DATA_MESSAGE : v}</span></li>)}
            </ul>
          </div>
        ))}
      </section>

      <section id="avaliacao" aria-labelledby="aval-h">
        <h2 id="aval-h" className="text-xl font-bold">Avaliação da pesquisa</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div className="card p-4"><p className="text-xs text-ink-3">Avaliações recebidas</p><p className="text-3xl font-bold">{r.feedback.total}</p></div>
          <div className="card p-4"><p className="text-xs text-ink-3">Nota média (1–5)</p><p className="text-3xl font-bold">{r.feedback.averageRating ?? "—"}</p><p className="text-xs text-ink-2">Por nota: {r.feedback.byRating.map((n, i) => `${i + 1}: ${n}`).join(" · ")}</p></div>
          <div className="card p-4"><p className="text-xs text-ink-3">Disseram que ajudou na decisão</p><p className="text-3xl font-bold">{r.feedback.shareHelpedYes === null ? "—" : `${r.feedback.shareHelpedYes}%`}</p><p className="text-xs text-ink-2">das avaliações que responderam · sim {r.feedback.helpedYes} · não {r.feedback.helpedNo} · não disseram {r.feedback.helpedUnanswered}</p></div>
        </div>
      </section>

      <section aria-label="Gráficos da avaliação" className="grid gap-4 md:grid-cols-2">
        <div className="card p-4">
          <h3 className="text-sm font-semibold">Notas da pesquisa</h3>
          <ul className="mt-3 space-y-2">
            {r.feedback.byRating.map((n, i) => (
              <BarRow key={i} tone="bg-purple" label={`Nota ${i + 1}`} count={n} share={r.feedback.total ? (n / r.feedback.total) * 100 : null} />
            )).reverse()}
          </ul>
        </div>
        <div className="card p-4">
          <h3 className="text-sm font-semibold">A pesquisa ajudou na decisão?</h3>
          <ul className="mt-3 space-y-2">
            <BarRow tone="bg-mint" label="Sim" count={r.feedback.helpedYes} share={r.feedback.total ? (r.feedback.helpedYes / r.feedback.total) * 100 : null} />
            <BarRow tone="bg-gold" label="Não" count={r.feedback.helpedNo} share={r.feedback.total ? (r.feedback.helpedNo / r.feedback.total) * 100 : null} />
            <BarRow tone="bg-ink-3" label="Preferiu não dizer" count={r.feedback.helpedUnanswered} share={r.feedback.total ? (r.feedback.helpedUnanswered / r.feedback.total) * 100 : null} />
          </ul>
        </div>
      </section>

      <section id="exportacao" aria-labelledby="exp-h" className="print:hidden">
        <h2 id="exp-h" className="text-xl font-bold">Exportação</h2>
        <p className="text-sm text-ink-2 mt-1">Apenas agregações. Nenhuma exportação contém registros individuais.</p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <a className="rounded-lg border border-line px-4 py-2 min-h-11 inline-flex items-center" href="/api/admin/research">JSON agregado</a>
          <a className="rounded-lg border border-line px-4 py-2 min-h-11 inline-flex items-center" href="/api/admin/research?format=csv">CSV por pergunta e alternativa</a>
          <PrintButton label="PDF do painel" fileTitle="Dados da pesquisa" />
        </div>
      </section>
    </div>
  );
}

/** Barra horizontal simples: rótulo, contagem e porcentagem. */
function BarRow({ label, count, share, tone = "bg-accent" }: { label: string; count: number; share: number | null; tone?: string }) {
  const pct = share ?? 0;
  return (
    <li className="space-y-0.5">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="min-w-0">{label}</span>
        <span className="shrink-0 tabular-nums text-ink-2">{count} · {share === null ? "—" : `${pct.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`}</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-line" aria-hidden="true">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
      </div>
    </li>
  );
}

function StatCard({ label, value, note, tone = "border-t-accent" }: { label: string; value: string; note?: string; tone?: string }) {
  return (
    <div className={`card border-t-4 p-4 ${tone}`}>
      <p className="text-xs text-ink-3">{label}</p>
      <p className="text-3xl font-bold tabular-nums">{value}</p>
      {note ? <p className="text-xs text-ink-2">{note}</p> : null}
    </div>
  );
}
