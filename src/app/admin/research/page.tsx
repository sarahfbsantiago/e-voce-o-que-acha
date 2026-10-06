import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageTitle } from "@/components/ui";
import { isAdminSession } from "@/lib/admin-auth";
import { getStatsRepository } from "@/lib/repository";
import { buildResearchReport } from "@/lib/research-report";
import { INSUFFICIENT_DATA_MESSAGE } from "@/domain/aggregates";
import { AGE_RANGES, REGIONS } from "@/domain/types";
import { formatShare } from "@/domain/aggregates";
import { logoutAction } from "../login/actions";

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

  const [submissions, feedback] = await Promise.all([stats.listSubmissions(), stats.listFeedback()]);
  const r = buildResearchReport(submissions, feedback);
  const ageLabel = Object.fromEntries(AGE_RANGES.map((a) => [a.value, a.label]));
  const regionLabel = Object.fromEntries(REGIONS.map((a) => [a.value, a.label]));

  return (
    <div className="container-page py-12 space-y-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageTitle lead="Somente agregações. Nenhum registro individual é exibido.">Dados da pesquisa</PageTitle>
        <form action={logoutAction}><button className="rounded-lg border border-line px-3 py-2 text-sm min-h-11">Sair</button></form>
      </div>

      <p className="rounded-xl border border-note-line bg-note px-4 py-3 text-sm font-medium">{r.disclaimer}</p>

      <nav aria-label="Seções" className="card p-3 text-sm flex flex-wrap gap-x-4 gap-y-1">
        {[["#visao", "Visão geral"], ["#temas", "Temas"], ["#perguntas", "Perguntas"], ["#prioridades", "Prioridades"], ["#tempo", "Evolução temporal"], ["#demografia", "Demografia opcional"], ["#avaliacao", "Avaliação da pesquisa"], ["#exportacao", "Exportação"]].map(([h, l]) => <a key={h} href={h} className="underline underline-offset-4">{l}</a>)}
      </nav>

      <section id="visao" className="grid gap-3 sm:grid-cols-3">
        <div className="card p-4"><p className="text-xs text-ink-3">Questionários recebidos</p><p className="text-3xl font-bold">{r.overview.totalSubmissions.toLocaleString("pt-BR")}</p><p className="text-xs text-ink-3">respostas</p></div>
        <div className="card p-4"><p className="text-xs text-ink-3">Com todas as perguntas respondidas</p><p className="text-3xl font-bold">{r.overview.completedAllQuestions.toLocaleString("pt-BR")}</p></div>
        <div className="card p-4"><p className="text-xs text-ink-3">Taxa de conclusão</p><p className="text-3xl font-bold">{r.overview.completionRate === null ? "—" : `${r.overview.completionRate}%`}</p><p className="text-xs text-ink-3">das respostas</p></div>
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
                <td className="p-2">{p.totalResponses ? formatShare(p.shareHighPriority) : "—"}</td>
                <td className="p-2 tabular-nums text-ink-2">{p.byLevel.join(" · ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="perguntas" aria-labelledby="perguntas-h" className="space-y-3">
        <h2 id="perguntas-h" className="text-xl font-bold">Perguntas</h2>
        {r.questions.map((q) => (
          <details key={q.questionId} className="card p-4">
            <summary className="text-sm font-medium">{q.questionId.toUpperCase()} — {q.text} <span className="text-ink-3">({q.totalResponses} respostas · {q.noOpinionCount} “não sei”)</span></summary>
            <ul className="mt-3 space-y-1 text-sm">
              {q.options.map((o) => (
                <li key={o.optionId} className="grid grid-cols-[1fr_auto_auto] gap-3 items-center">
                  <span>{o.label}</span>
                  <span className="tabular-nums text-ink-2">{o.count}</span>
                  <span className="tabular-nums w-40 text-right">{q.totalResponses ? formatShare(o.shareOfResponses) : "—"}</span>
                </li>
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

      <section id="tempo" aria-labelledby="tempo-h">
        <h2 id="tempo-h" className="text-xl font-bold">Evolução temporal</h2>
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

      <section id="exportacao" aria-labelledby="exp-h">
        <h2 id="exp-h" className="text-xl font-bold">Exportação</h2>
        <p className="text-sm text-ink-2 mt-1">Apenas agregações. Nenhuma exportação contém registros individuais.</p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <a className="rounded-lg border border-line px-4 py-2 min-h-11 inline-flex items-center" href="/api/admin/research">JSON agregado</a>
          <a className="rounded-lg border border-line px-4 py-2 min-h-11 inline-flex items-center" href="/api/admin/research?format=csv">CSV por pergunta e alternativa</a>
        </div>
      </section>
    </div>
  );
}
