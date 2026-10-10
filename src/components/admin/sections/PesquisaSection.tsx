import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { isAdminSession } from "@/lib/admin-auth";
import { getContentRepository, getStatsRepository } from "@/lib/repository";
import { aggregateProfileProximity } from "@/domain/profile-proximity";
import { QUESTIONS } from "@/data/questions";
import { QUESTION_NUMBER } from "@/lib/question-order";
import { buildResearchReport } from "@/lib/research-report";
import { INSUFFICIENT_DATA_MESSAGE } from "@/domain/aggregates";
import { AGE_RANGES, REGIONS } from "@/domain/types";
import { SPECTRUM_BANDS, ideologySpot } from "@/data/political-spectrum";
import { ensureLiveConfig } from "@/lib/live-config-server";
import { logoutAction } from "@/app/admin/login/actions";


const BRL = (n: number) => n.toLocaleString("pt-BR");
const PCT = (n: number | null) => (n === null ? "—" : `${n.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`);
const CAND_COLORS = ["#6d3fc4", "#2f9a5d"];
/** Cor fixa por candidato, igual em todos os gráficos. */
const candColor = (id: string) => (id === "lula" ? CAND_COLORS[0] : CAND_COLORS[1]);
/** Cor da ideologia = cor da faixa da régua onde ela fica. */
const ideologyColor = (label: string) => {
  const at = ideologySpot(label);
  return at === null ? "#9ca3af" : SPECTRUM_BANDS[Math.min(SPECTRUM_BANDS.length - 1, Math.floor(at))].color;
};

/**
 * Painel da pesquisa em uma página só, no estilo dashboard: números no topo, gráficos em quadros.
 * Só agregações; nenhum registro individual. Visível apenas no admin.
 */
export async function PesquisaSection() {
  await ensureLiveConfig();
  if (!(await isAdminSession())) redirect("/admin/login");
  const stats = await getStatsRepository();

  if (!stats.enabled) {
    return (
      <div className="container-page py-12 max-w-3xl">
        <h1 className="text-2xl font-bold">Dados da pesquisa</h1>
        <p className="card mt-4 p-4 text-sm">Estatísticas indisponíveis: banco de dados não configurado (modo estático). Defina <code>DATABASE_URL</code>, rode as migrações e o seed.</p>
      </div>
    );
  }

  const content = await getContentRepository();
  const [submissions, feedback, candidates, positions] = await Promise.all([stats.listSubmissions(), stats.listFeedback(), content.getCandidates(), content.getPublishedPositions()]);
  const pp = aggregateProfileProximity(submissions, QUESTIONS, candidates, positions);
  const r = buildResearchReport(submissions, feedback, pp);
  const name = (id: string) => candidates.find((c) => c.id === id)?.name ?? id;
  const first = (id: string) => name(id).split(" ")[0];
  const ageLabel = Object.fromEntries(AGE_RANGES.map((a) => [a.value, a.label]));
  const regionLabel = Object.fromEntries(REGIONS.map((a) => [a.value, a.label]));
  const ideo = r.ideology;
  const topIdeology = [...ideo.byIdeology].sort((a, b) => b.count - a.count)[0];
  const lulaRuler = ideo.closerOnRuler.find((c) => c.candidateId === "lula");
  const noOpinionTop = [...r.questions].filter((q) => q.totalResponses > 0).sort((a, b) => b.noOpinionCount / b.totalResponses - a.noOpinionCount / a.totalResponses).slice(0, 5);
  const prioTop = [...r.priorities].sort((a, b) => b.shareHighPriority - a.shareHighPriority);
  const maxDay = Math.max(...r.timeline.map((x) => x.count), 1);
  // avaliação: proporções entre quem respondeu a avaliação (não sobre o total de questionários)
  const base = r.feedback.total;
  const ofBase = (n: number) => (base ? Math.round((n / base) * 1000) / 10 : null);
  const helpedNoAnswer = r.feedback.helpedUnanswered;
  const notRated = base - r.feedback.byRating.reduce((n, x) => n + x, 0);
  const evalShare = r.overview.totalSubmissions ? Math.round((base / r.overview.totalSubmissions) * 1000) / 10 : null;

  return (
    <>

        {/* cabeçalho */}
        <header className="admin-hero flex flex-wrap items-end justify-between gap-3 rounded-2xl bg-gradient-to-r from-[#3b1f7a] via-purple to-[#2563eb] p-4 text-white shadow-lg shadow-purple/20 md:p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Painel da pesquisa</p>
            <h1 className="mt-1 text-2xl font-bold md:text-3xl">Dados da pesquisa</h1>
            <p className="mt-1 text-sm text-white/80">Somente agregações · atualizado em {new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <a className="rounded-lg bg-white/15 px-3 py-2 text-sm font-medium ring-1 ring-white/30 hover:bg-white/25" href="/api/admin/research?format=csv">CSV</a>
            <a className="rounded-lg bg-white/15 px-3 py-2 text-sm font-medium ring-1 ring-white/30 hover:bg-white/25" href="/api/admin/research">JSON</a>
            <a href="/admin/completo" className="inline-flex min-h-10 items-center rounded-lg bg-white/15 px-3 py-2 text-sm font-semibold ring-1 ring-white/30 hover:bg-white/25">Exportar PDF</a>
            <form action={logoutAction}><button className="min-h-10 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-purple-strong">Sair</button></form>
          </div>
        </header>

        {/* números principais */}
        <section aria-label="Números principais" className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-7">
          <Kpi label="Questionários" value={BRL(r.overview.totalSubmissions)} note="recebidos" color="#6d3fc4" />
          <Kpi label="Conclusão" value={PCT(r.overview.completionRate)} note={`${BRL(r.overview.completedAllQuestions)} com as ${QUESTIONS.length} perguntas`} color="#2563eb" />
          <Kpi label="Ideologia mais comum" value={topIdeology && topIdeology.count ? topIdeology.label : "—"} note={topIdeology && topIdeology.count ? `${PCT(topIdeology.share)} dos perfis` : "sem dados"} color={topIdeology ? ideologyColor(topIdeology.label) : "#9ca3af"} small />
          <Kpi label="Perto de Lula na régua" value={PCT(lulaRuler?.share ?? null)} note={`${BRL(lulaRuler?.count ?? 0)} perfis`} color={CAND_COLORS[0]} />
          <Kpi label="Responderam a avaliação" value={BRL(base)} note={`${PCT(evalShare)} dos questionários`} color="#2563eb" />
          <Kpi label="Ajudou na decisão" value={PCT(ofBase(r.feedback.helpedYes))} note={`${r.feedback.helpedYes} de ${BRL(base)} que avaliaram`} color="#d4a017" />
          <Kpi label="Nota da pesquisa" value={r.feedback.averageRating === null ? "—" : String(r.feedback.averageRating).replace(".", ",")} note={`média entre os ${BRL(base - notRated)} que deram nota`} color="#ec4899" />
        </section>

        {/* perfil ideológico */}
        <section aria-label="Perfil ideológico" className="grid gap-4 lg:grid-cols-3">
          <Panel title="Perfil ideológico das pessoas" subtitle={`${BRL(ideo.total)} questionários com posição na régua`} className="lg:col-span-2">
            {ideo.total ? (
              <div className="grid items-center gap-5 sm:grid-cols-[180px_1fr]">
                <Donut size={180} parts={ideo.byIdeology.filter((x) => x.count).map((x) => ({ value: x.count, color: ideologyColor(x.label) }))} center={BRL(ideo.total)} centerNote="perfis" />
                <ul className="space-y-2">
                  {ideo.byIdeology.map((x) => <Bar key={x.label} label={x.label} count={x.count} share={x.share} color={ideologyColor(x.label)} />)}
                </ul>
              </div>
            ) : <Empty />}
          </Panel>
          <Panel title="Análise geral: mais perto na régua ideológica" subtitle="De comunismo a conservadorismo: Lula · de nacionalismo radical em diante: Flávio">
            {ideo.total ? (
              <div className="flex flex-col items-center gap-4">
                <Donut size={150} parts={ideo.closerOnRuler.map((c) => ({ value: c.count, color: candColor(c.candidateId) }))} center={PCT(lulaRuler?.share ?? null)} centerNote={first("lula")} />
                <ul className="w-full space-y-2">{ideo.closerOnRuler.map((c) => <Bar key={c.candidateId} label={name(c.candidateId)} count={c.count} share={c.share} color={candColor(c.candidateId)} />)}</ul>
              </div>
            ) : <Empty />}
          </Panel>
          <Panel title="Onde as pessoas caem na régua" subtitle="Quantos perfis em cada faixa" className="lg:col-span-3">
            {ideo.total ? (
              <div>
                <div className="flex h-40 items-end gap-2" role="img" aria-label={ideo.byBand.map((b) => `${b.label}: ${b.count}`).join("; ")}>
                  {ideo.byBand.map((b) => {
                    const max = Math.max(...ideo.byBand.map((x) => x.count), 1);
                    return (
                      <div key={b.label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
                        <span className="text-xs font-semibold tabular-nums text-ink-2">{b.count}</span>
                        <div className="w-full rounded-t-md" style={{ height: `${(b.count / max) * 100}%`, minHeight: 3, background: b.color }} />
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 grid grid-cols-8 gap-2 text-center text-[11px] leading-tight text-ink-3">{ideo.byBand.map((b) => <span key={b.label}>{b.label}</span>)}</div>
              </div>
            ) : <Empty />}
          </Panel>
        </section>

        {/* candidatos por tema, tempo */}
        <section className="grid gap-4 lg:grid-cols-3">
          <Panel title="Análises específicas: mais perto nos temas" subtitle="Quem ficou mais perto em mais temas (notas por alternativa), por questionário">
            {pp.withComparison > 0 ? (
              <div className="flex flex-col items-center gap-4">
                <Donut size={150} parts={[...pp.byCandidate.map((b) => ({ value: b.count, color: candColor(b.candidateId) })), { value: pp.ties, color: "#d6d3cc" }]} center={BRL(pp.withComparison)} centerNote="comparáveis" />
                <ul className="w-full space-y-2">
                  {pp.byCandidate.map((b) => <Bar key={b.candidateId} label={name(b.candidateId)} count={b.count} share={b.share} color={candColor(b.candidateId)} />)}
                  <Bar label="Empate" count={pp.ties} share={Math.round((pp.ties / pp.withComparison) * 1000) / 10} color="#d6d3cc" />
                </ul>
              </div>
            ) : <Empty />}
          </Panel>
          <Panel title="Questionários por dia" subtitle={r.timeline.length ? `${r.timeline[0].date} a ${r.timeline[r.timeline.length - 1].date}` : "sem dados"} className="lg:col-span-2">
            {r.timeline.length ? (
              <div className="flex h-48 items-end gap-1" role="img" aria-label={r.timeline.map((t) => `${t.date}: ${t.count}`).join("; ")}>
                {r.timeline.map((t) => (
                  <div key={t.date} className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1" title={`${t.date}: ${t.count}`}>
                    <span className="text-[10px] tabular-nums text-ink-3 opacity-0 group-hover:opacity-100">{t.count}</span>
                    <div className="w-full rounded-t-md bg-gradient-to-t from-purple to-[#2563eb]" style={{ height: `${(t.count / maxDay) * 100}%`, minHeight: 3 }} />
                  </div>
                ))}
              </div>
            ) : <Empty />}
          </Panel>
        </section>

        {/* prioridades, não sei */}
        <section className="grid gap-4 lg:grid-cols-2">
          <Panel title="Temas mais importantes" subtitle="% que marcou muito importante ou prioridade máxima">
            <ul className="space-y-2">{prioTop.map((p) => <Bar key={p.topicId} label={p.topicName} count={p.totalResponses} share={p.totalResponses ? Math.round(p.shareHighPriority * 10) / 10 : null} color="#6d3fc4" countLabel="respostas" />)}</ul>
          </Panel>
          <Panel title="Perguntas com mais “não sei”" subtitle="Pode indicar pergunta confusa ou tema pouco conhecido">
            {noOpinionTop.length ? <ul className="space-y-2">{noOpinionTop.map((q) => <Bar key={q.questionId} label={`${QUESTION_NUMBER[q.questionId]}. ${q.text}`} count={q.noOpinionCount} share={Math.round((q.noOpinionCount / q.totalResponses) * 1000) / 10} color="#d4a017" />)}</ul> : <Empty />}
          </Panel>
        </section>

        {/* avaliação, demografia */}
        <section className="grid gap-4 lg:grid-cols-4">
          <Panel title="Notas da pesquisa" subtitle={`% entre os ${BRL(base)} que responderam a avaliação`}>
            <ul className="space-y-2">
              {r.feedback.byRating.map((n, i) => <Bar key={i} label={`${"★".repeat(i + 1)}`} count={n} share={ofBase(n)} color="#ec4899" />).reverse()}
              {notRated > 0 ? <Bar label="Sem nota" count={notRated} share={ofBase(notRated)} color="#d6d3cc" /> : null}
            </ul>
          </Panel>
          <Panel title="Ajudou na decisão?" subtitle={`% entre os ${BRL(base)} que responderam a avaliação`}>
            {base ? (
              <div className="flex flex-col items-center gap-3">
                <Donut size={130} parts={[{ value: r.feedback.helpedYes, color: "#2f9a5d" }, { value: r.feedback.helpedNo, color: "#d4a017" }, { value: helpedNoAnswer, color: "#d6d3cc" }]} center={PCT(ofBase(r.feedback.helpedYes))} centerNote="sim" />
                <ul className="w-full space-y-2">
                  <Bar label="Sim" count={r.feedback.helpedYes} share={ofBase(r.feedback.helpedYes)} color="#2f9a5d" />
                  <Bar label="Não" count={r.feedback.helpedNo} share={ofBase(r.feedback.helpedNo)} color="#d4a017" />
                  <Bar label="Não respondeu" count={helpedNoAnswer} share={ofBase(helpedNoAnswer)} color="#d6d3cc" />
                </ul>
              </div>
            ) : <Empty />}
          </Panel>
          {([["Faixa etária", r.demographics.ageRange, ageLabel], ["Região", r.demographics.region, regionLabel]] as const).map(([title, dist, labels]) => {
            const entries = Object.entries(dist as Record<string, number | null>);
            const total = entries.reduce((n, [, v]) => n + (v ?? 0), 0);
            return (
              <Panel key={title} title={title} subtitle={`grupos com menos de ${r.minAggregateGroupSize} ficam ocultos`}>
                {entries.length ? <ul className="space-y-2">{entries.map(([k, v]) => v === null ? <li key={k} className="text-xs text-ink-3">{(labels as Record<string, string>)[k] ?? k}: {INSUFFICIENT_DATA_MESSAGE}</li> : <Bar key={k} label={(labels as Record<string, string>)[k] ?? k} count={v} share={total ? Math.round((v / total) * 1000) / 10 : null} color="#2563eb" />)}</ul> : <Empty />}
              </Panel>
            );
          })}
        </section>

        {/* perguntas */}
        <Panel split title="Respostas por pergunta" subtitle="Quantas pessoas escolheram cada alternativa">
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 md:mx-0 md:grid md:overflow-visible md:px-0 md:pb-0 print:mx-0 print:grid print:overflow-visible print:px-0 md:grid-cols-2 xl:grid-cols-3">
            {[...r.questions].sort((a, b) => QUESTION_NUMBER[a.questionId] - QUESTION_NUMBER[b.questionId]).map((q) => (
              <div key={q.questionId} className="w-[86%] shrink-0 snap-start md:w-auto md:shrink print:w-auto min-w-0 rounded-xl border border-line bg-paper/50 p-3 print:break-inside-avoid">
                <p className="text-xs font-semibold leading-snug text-ink" title={`código interno ${q.questionId}`}><span className="mr-1 rounded bg-purple px-1.5 py-0.5 text-[10px] font-bold text-white">{QUESTION_NUMBER[q.questionId]}</span>{q.text}</p>
                <p className="mt-1 text-[11px] text-ink-3">{BRL(q.totalResponses)} respostas · {q.noOpinionCount} “não sei”</p>
                <ul className="mt-2 space-y-1.5">
                  {q.options.map((o) => <Bar key={o.optionId} label={o.label} count={o.count} share={q.totalResponses ? o.shareOfResponses : null} color={o.label === "Não sei" ? "#9ca3af" : "#6d3fc4"} compact />)}
                </ul>
              </div>
            ))}
          </div>
        </Panel>

        <p className="text-center text-xs text-ink-3">{r.disclaimer}</p>
    </>
  );
}

function Kpi({ label, value, note, color, small = false }: { label: string; value: string; note: string; color: string; small?: boolean }) {
  return (
    <div className="admin-lift relative overflow-hidden rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-black/5 print:break-inside-avoid print:border print:border-line">
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5" style={{ background: color }} />
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-3">{label}</p>
      <p className={`mt-1 font-bold tabular-nums text-ink ${small ? "text-lg leading-tight" : "text-3xl"}`}>{value}</p>
      <p className="mt-0.5 text-xs text-ink-2">{note}</p>
    </div>
  );
}

function Panel({ title, subtitle, children, className = "", split = false }: { title: string; subtitle?: string; children: ReactNode; className?: string; split?: boolean }) {
  return (
    <section className={`min-w-0 rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-black/5 md:p-5 print:border print:border-line ${split ? "" : "print:break-inside-avoid"} ${className}`}>
      <h2 className="text-sm font-bold text-ink">{title}</h2>
      {subtitle ? <p className="text-xs text-ink-3">{subtitle}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Empty() {
  return <p className="py-6 text-center text-sm text-ink-3">Sem dados ainda.</p>;
}

/** Rosca em CSS (conic-gradient): cada parte na sua cor, número no meio. */
function Donut({ parts, size, center, centerNote }: { parts: { value: number; color: string }[]; size: number; center: string; centerNote: string }) {
  const total = parts.reduce((n, p) => n + p.value, 0) || 1;
  const ends = parts.map((_, i) => parts.slice(0, i + 1).reduce((n, p) => n + p.value, 0));
  const stops = parts.map((p, i) => `${p.color} ${((ends[i] - p.value) / total) * 360}deg ${(ends[i] / total) * 360}deg`).join(", ");
  return (
    <div className="relative shrink-0 rounded-full" style={{ width: size, height: size, background: `conic-gradient(${stops || "#e3e1db 0deg 360deg"})` }} role="img" aria-label={`${center} ${centerNote}`}>
      <div className="absolute inset-[18%] flex flex-col items-center justify-center rounded-full bg-surface text-center shadow-inner">
        <span className="text-xl font-bold tabular-nums leading-none text-ink">{center}</span>
        <span className="mt-1 text-[11px] text-ink-3">{centerNote}</span>
      </div>
    </div>
  );
}

/** Barra horizontal: rótulo, contagem e porcentagem. */
function Bar({ label, count, share, color, compact = false, countLabel }: { label: string; count: number; share: number | null; color: string; compact?: boolean; countLabel?: string }) {
  const pct = share ?? 0;
  return (
    <li className="space-y-0.5 list-none">
      <div className={`flex items-baseline justify-between gap-3 ${compact ? "text-xs" : "text-sm"}`}>
        <span className="min-w-0 truncate" title={label}>{label}</span>
        <span className="shrink-0 tabular-nums text-ink-2">{count}{countLabel ? ` ${countLabel}` : ""} · {PCT(share)}</span>
      </div>
      <div className={`${compact ? "h-1.5" : "h-2.5"} w-full overflow-hidden rounded-full bg-line`} aria-hidden="true">
        <div className="h-full rounded-full" style={{ width: `${Math.min(100, Math.max(0, pct))}%`, background: color }} />
      </div>
    </li>
  );
}
