import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/AdminUI";
import { PrintOnLoad } from "@/components/admin/PrintOnLoad";
import { AREA_GROUPS } from "@/components/report/areaGroups";
import { TOPICS } from "@/data/topics";
import { IDEOLOGY_RANGES, RULER_RULES, SPECTRUM_BANDS } from "@/data/political-spectrum";
import { getWorkingConfig } from "@/lib/live-config-server";
import { bandKey, questionNumbers, scopeChanged, scoreKey, type LiveConfig } from "@/lib/live-config";
import type { Question } from "@/domain/types";
import exemploTemas from "@/components/admin/guia/exemplo-temas.png";
import exemploRegua from "@/components/admin/guia/exemplo-regua.png";
import exemploRelatorioRegua from "@/components/admin/guia/exemplo-relatorio-regua.png";

export const metadata: Metadata = { title: "Perguntas, pesos e régua", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const CANDS = [{ id: "lula", name: "Lula" }, { id: "flavio-bolsonaro", name: "Flávio" }];
const num = (n: number) => String(Math.round(n * 100) / 100).replace(".", ",");
const bandColor = (label: string) => SPECTRUM_BANDS.find((b) => b.label === label)?.color ?? "#9ca3af";
const TAG: Record<string, string> = { "no site": "bg-mint text-white", "alterada no rascunho": "bg-[#f97316] text-white", "nova no rascunho": "bg-[#f97316] text-white", arquivada: "bg-line text-ink-2", "arquivada no rascunho": "bg-[#f97316] text-white" };

function QuestionCard({ q, cfg, n, status, topic }: { q: Question; cfg: LiveConfig; n: number | null; status: string; topic: string }) {
  return (
    <article className="overflow-hidden rounded-xl bg-surface ring-1 ring-line print:break-inside-avoid print:border print:border-line">
      <div className="flex flex-wrap items-center gap-2 border-b border-line bg-paper/60 px-3 py-2 text-xs">
        {n ? <span className="rounded-md bg-purple px-1.5 py-0.5 font-bold text-white">Pergunta {n}</span> : null}
        <span className="text-ink-3">{topic}</span>
        <span className={`ml-auto rounded-full px-2 py-0.5 font-bold ${TAG[status]}`}>{status}</span>
      </div>
      <div className="p-3">
        <p className="text-sm font-bold leading-snug text-ink">{q.text}</p>
        {q.example ? <p className="mt-1 text-xs italic text-ink-3">Exemplo: {q.example}</p> : null}
        <table className="mt-3 w-full text-left text-xs">
          <thead><tr className="text-[10px] uppercase tracking-wide text-ink-3"><th className="pb-1 font-semibold">Alternativa</th>{CANDS.map((c) => <th key={c.id} className="w-14 pb-1 text-center font-semibold">{c.name}</th>)}<th className="w-40 pb-1 pl-4 font-semibold">Régua</th></tr></thead>
          <tbody className="divide-y divide-line">
            {q.options.map((o) => {
              const band = o.isNoOpinion ? null : cfg.spectrumPositions[bandKey(q.id, o.id)]?.[0] ?? null;
              return (
                <tr key={o.id}>
                  <td className="py-1.5 pr-2 text-ink-2">{o.label}</td>
                  {CANDS.map((c) => {
                    const s = o.isNoOpinion ? undefined : cfg.optionScores[scoreKey(q.id, c.id, o.id)]?.[0];
                    return <td key={c.id} className={`py-1.5 text-center tabular-nums ${s === 1 ? "font-bold text-ink" : "text-ink-2"}`}>{s === undefined ? "—" : num(s)}</td>;
                  })}
                  <td className="py-1.5 pl-4">{o.isNoOpinion ? <span className="text-ink-3">não entra</span> : band ? <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: bandColor(band), printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }} />{band}</span> : <span className="text-[#9b1c1c]">sem faixa</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </article>
  );
}

/** PDF das perguntas: todas (no site, arquivadas e do rascunho) com peso por candidato e faixa da régua, e como ler. */
export default async function Page() {
  if (!(await isAdminSession())) redirect("/admin/login");
  const { cfg, published } = await getWorkingConfig();
  const live = published.cfg;
  const liveIds = new Set(live.questions.map((q) => q.id));
  const topicOrder = AREA_GROUPS.flatMap((g) => TOPICS.filter((t) => g.topicIds.includes(t.id)).sort((a, b) => a.order - b.order).map((t) => t.id));
  const nums = questionNumbers(cfg, topicOrder);
  const topicName = (id: string) => TOPICS.find((t) => t.id === id)?.name ?? id;
  const status = (q: Question) => {
    const arch = cfg.archived.includes(q.id);
    if (!liveIds.has(q.id)) return arch ? "arquivada no rascunho" : "nova no rascunho";
    if (arch) return live.archived.includes(q.id) ? "arquivada" : "arquivada no rascunho";
    return scopeChanged(live, cfg, { kind: "question", id: q.id }) ? "alterada no rascunho" : "no site";
  };
  const active = cfg.questions.filter((q) => !cfg.archived.includes(q.id));
  const archived = cfg.questions.filter((q) => cfg.archived.includes(q.id));
  const inDraft = cfg.questions.filter((q) => status(q) !== "no site" && status(q) !== "arquivada").length;

  // exemplo da régua com os valores da versão no ar
  const mean = (2.5 + 3.5 + 4.5) / 3;
  const ideology = IDEOLOGY_RANGES.find((r) => mean <= r.upTo)?.label ?? "—";
  const split = RULER_RULES.rightSideFrom;
  const box = "rounded-2xl bg-surface p-4 ring-1 ring-line print:break-inside-avoid print:border print:border-line";

  return (
    <AdminShell current="/admin/perguntas">
      <PrintOnLoad fileTitle="Perguntas, pesos e régua" />
      <header className="rounded-2xl bg-gradient-to-r from-[#3b1f7a] via-purple to-[#2563eb] p-5 text-white" style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">E Você, O Que Acha?</p>
        <h1 className="mt-1 text-2xl font-bold">Perguntas, pesos e régua</h1>
        <p className="mt-1 text-sm text-white/85">
          {active.length} no questionário · {archived.length} arquivadas · {inDraft} com mudança no rascunho · versão no ar v{published.version} · gerado em {new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        </p>
        <p className="mt-2 text-xs text-white/80">Numeração e textos como estão no rascunho. Lula e Flávio = peso de cada alternativa (1, 0,5 ou 0). Régua = faixa para onde a alternativa leva. Como ler: no final.</p>
      </header>

      {AREA_GROUPS.map((g, gi) => {
        const qs = TOPICS.filter((t) => g.topicIds.includes(t.id)).sort((a, b) => a.order - b.order).flatMap((t) => active.filter((q) => q.topicId === t.id).sort((a, b) => a.order - b.order));
        if (!qs.length) return null;
        return (
          <section key={g.id} className="space-y-3">
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink print:break-after-avoid"><span className="grid h-7 w-7 place-items-center rounded-lg text-sm text-white" style={{ background: g.color, printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}>{gi + 1}</span>{g.label}</h2>
            <div className="grid gap-3 lg:grid-cols-2 print:grid-cols-1">{qs.map((q) => <QuestionCard key={q.id} q={q} cfg={cfg} n={nums[q.id] ?? null} status={status(q)} topic={topicName(q.topicId)} />)}</div>
          </section>
        );
      })}

      {archived.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-ink print:break-after-avoid">Arquivadas (fora do site)</h2>
          <div className="grid gap-3 lg:grid-cols-2 print:grid-cols-1">{archived.map((q) => <QuestionCard key={q.id} q={q} cfg={cfg} n={null} status={status(q)} topic={topicName(q.topicId)} />)}</div>
        </section>
      ) : null}

      <section className="space-y-4 print:break-before-page">
        <h2 className="text-xl font-bold text-ink">Como ler este documento</h2>

        <div className={box}>
          <h3 className="text-base font-bold text-ink">1. Peso por candidato (colunas Lula e Flávio)</h3>
          <p className="mt-1 text-sm text-ink-2">Decide, tema a tema, de quem a pessoa fica mais próxima. <b>1</b> = o candidato defende aquela alternativa · <b>0,5</b> = defende em parte · <b>0</b> = não defende. &quot;Não sei&quot; não conta.</p>
          <p className="mt-2 text-sm text-ink-2">Em cada tema, soma-se o peso de cada candidato nas perguntas que a pessoa respondeu e divide-se pelo número de perguntas respondidas. Quem tiver mais leva o tema; empate não indica ninguém. O perfil final é quem levou mais temas.</p>
          <div className="mt-3 rounded-xl bg-purple-soft/50 p-3 text-sm text-ink">
            <p className="font-bold">Exemplo: Fulano respondeu 2 perguntas do tema &quot;Economia e impostos&quot;</p>
            <ul className="mt-1 space-y-0.5 text-ink-2">
              <li>• Pergunta A: &quot;Concordo&quot;, que vale Lula 1 e Flávio 0</li>
              <li>• Pergunta B: &quot;Concordo em parte&quot;, que vale Lula 0,5 e Flávio 0,5</li>
              <li>• Lula: (1 + 0,5) ÷ 2 = <b>0,75</b> · Flávio: (0 + 0,5) ÷ 2 = <b>0,25</b></li>
              <li>• O tema fica <b>&quot;Lula&quot;</b>.</li>
            </ul>
          </div>
          <div className="mt-3 rounded-xl p-3 ring-2 ring-purple/30">
            <p className="text-sm font-bold text-ink">Onde isso aparece no relatório da pessoa</p>
            <p className="mt-1 text-sm text-ink-2">No fim do questionário, o relatório mostra, tema a tema, se as respostas da pessoa ficaram mais próximas de Lula ou de Flávio (o selo ao lado de cada tema), e quantos temas cada um levou (&quot;X de 12 temas comparáveis&quot;). Os pesos desta tabela decidem cada selo.</p>
            <Image src={exemploTemas} loading="eager" unoptimized alt="Relatório: total de temas de cada candidato e o selo de cada tema" className="mt-2 w-full max-w-md rounded-lg ring-1 ring-line" />
          </div>
        </div>

        <div className={box}>
          <h3 className="text-base font-bold text-ink">2. Régua (coluna Régua)</h3>
          <p className="mt-1 text-sm text-ink-2">Decide a ideologia da pessoa, sem olhar os candidatos. Cada alternativa leva a uma faixa, e cada faixa vale o seu meio:</p>
          <div className="mt-2 grid grid-cols-4 gap-1 text-center text-[11px] sm:grid-cols-8">
            {SPECTRUM_BANDS.map((b, i) => <div key={b.label} className="rounded-md px-1 py-1.5 font-bold text-white" style={{ background: b.color, printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}>{b.label}<br />{num(i + 0.5)}</div>)}
          </div>
          <p className="mt-2 text-sm text-ink-2">A posição da pessoa é a média das respostas (&quot;Não sei&quot; não entra). Essa média cai num trecho de ideologia, que vira &quot;Sua ideologia&quot;. Se a ideologia fica antes da divisa ({num(split)}), a frase final diz &quot;mais próxima de Lula&quot;; a partir dela, &quot;de Flávio&quot;.</p>
          <div className="mt-3 rounded-xl bg-[#dbeafe]/60 p-3 text-sm text-ink">
            <p className="font-bold">Exemplo: Fulano marcou 3 respostas</p>
            <ul className="mt-1 space-y-0.5 text-ink-2">
              <li>• Centro-esquerda (2,5) · Centro (3,5) · Centro-direita (4,5)</li>
              <li>• Média: (2,5 + 3,5 + 4,5) ÷ 3 = <b>{num(mean)}</b></li>
              <li>• Cai em <b>{ideology}</b> → &quot;Sua ideologia&quot;</li>
              <li>• Antes da divisa {num(split)} → &quot;mais próxima de <b>Lula</b>&quot;</li>
            </ul>
          </div>
          <div className="mt-3 rounded-xl p-3 ring-1 ring-line">
            <p className="text-sm font-bold text-ink">Como a régua é montada (aba Régua do espectro)</p>
            <p className="mt-1 text-sm text-ink-2">As correntes, Lula, Flávio, a divisa e, embaixo, os trechos de cada ideologia (1 a {IDEOLOGY_RANGES.length}). A média da pessoa cai num desses trechos.</p>
            <Image src={exemploRegua} loading="eager" unoptimized alt="Régua do espectro no admin: correntes, Lula, Flávio, a divisa e os trechos das ideologias" className="mt-2 w-full rounded-lg ring-1 ring-line" />
          </div>
          <div className="mt-3 rounded-xl p-3 ring-2 ring-[#2563eb]/30 print:break-inside-avoid">
            <p className="text-sm font-bold text-ink">Onde isso aparece no relatório da pessoa</p>
            <p className="mt-1 text-sm text-ink-2">No fim do relatório, em &quot;Onde você fica no espectro ideológico político&quot;: a seta <b>Você</b> fica no ponto da ideologia da pessoa (no exemplo, &quot;Você · Progressismo&quot;), ao lado de Lula e Flávio, e a frase final diz de qual candidato a ideologia está mais próxima.</p>
            <Image src={exemploRelatorioRegua} loading="eager" unoptimized alt="Relatório: régua do espectro com a seta Você na ideologia da pessoa" className="mt-2 w-full max-w-xl rounded-lg ring-1 ring-line" />
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
