"use client";

import { useEffect, useState } from "react";
import type { Candidate, CandidatePosition, CandidateProfile, Evidence, ProgramSummary, SourceRegistryEntry } from "@/domain/types";
import { applyConfig, type LiveConfig } from "@/lib/live-config";
import { ReportView } from "@/components/report/ReportView";
import { QUESTIONS } from "@/data/questions";
import { QUESTION_NUMBER } from "@/lib/question-order";
import type { SessionState } from "@/store/session";

type Sample = { label: string; session: SessionState };

/**
 * Prévia de como o site vai ficar com o pedido: aplica a configuração do pedido só neste navegador,
 * mostra o relatório de um questionário de exemplo e o questionário; ao sair, volta para a versão no ar.
 */
export function SitePreview({ cfg, live, previewKey, liveKey, samples, data }: {
  cfg: LiveConfig; live: LiveConfig; previewKey: string; liveKey: string; samples: Sample[];
  data: { candidates: Candidate[]; positions: CandidatePosition[]; evidence: Evidence[]; summaries: ProgramSummary[]; sources: SourceRegistryEntry[]; profiles: CandidateProfile[] };
}) {
  applyConfig(cfg, previewKey);
  useEffect(() => () => applyConfig(live, liveKey), [live, liveKey]);
  const [tab, setTab] = useState<"relatorio" | "perguntas">("relatorio");
  const [k, setK] = useState(0);
  const tabBtn = (id: typeof tab, l: string) => <button type="button" onClick={() => setTab(id)} className={`rounded-xl px-4 py-2 text-sm font-bold ${tab === id ? "bg-purple text-white" : "bg-surface text-ink-2 ring-1 ring-line"}`}>{l}</button>;
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {tabBtn("relatorio", "Relatório de exemplo")}
        {tabBtn("perguntas", `Questionário (${QUESTIONS.length})`)}
        {tab === "relatorio" ? (
          <select value={k} onChange={(e) => setK(Number(e.target.value))} className="ml-auto rounded-lg border border-line bg-surface px-2.5 py-2 text-sm">
            {samples.map((s, i) => <option key={i} value={i}>{s.label}</option>)}
          </select>
        ) : null}
      </div>
      <div className="max-h-[80vh] overflow-y-auto rounded-2xl bg-paper ring-2 ring-purple/30">
        <p className="sticky top-0 z-20 bg-purple px-4 py-1.5 text-center text-xs font-bold text-white">PRÉ-VISUALIZAÇÃO · ainda não está no site</p>
        {tab === "relatorio" ? (
          <ReportView key={k} {...data} previewSession={samples[k].session} />
        ) : (
          <ol className="space-y-2 p-4">
            {[...QUESTIONS].sort((a, b) => QUESTION_NUMBER[a.id] - QUESTION_NUMBER[b.id]).map((q) => (
              <li key={q.id} className="rounded-xl bg-surface p-3 ring-1 ring-line">
                <p className="text-sm font-semibold text-ink"><span className="mr-2 rounded bg-purple px-1.5 text-[11px] font-bold text-white">{QUESTION_NUMBER[q.id]}</span>{q.text}</p>
                {q.example ? <p className="mt-1 text-xs text-ink-2">{q.example}</p> : null}
                <p className="mt-1.5 flex flex-wrap gap-1">{q.options.map((o) => <span key={o.id} className="rounded-full bg-purple-soft px-2 py-0.5 text-xs text-purple-strong">{o.label}</span>)}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
