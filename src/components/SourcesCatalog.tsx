"use client";

import { useMemo, useState } from "react";
import type { Candidate, Evidence, SourceRegistryEntry, Topic } from "@/domain/types";
import { EVIDENCE_CLASSIFICATION_LABELS, EVIDENCE_STRENGTH_LABELS, SOURCE_LEGEND_LABELS } from "@/domain/types";
import { SourceLegendBadge, SourceLink, VerificationNote } from "./SourceBits";
import { formatDate } from "@/lib/format";

export function SourcesCatalog({ sources, candidates, topics, evidence }: { sources: SourceRegistryEntry[]; candidates: Candidate[]; topics: Topic[]; evidence: Evidence[] }) {
  const [q, setQ] = useState("");
  const [institution, setInstitution] = useState("");
  const [legend, setLegend] = useState("");
  const [candidate, setCandidate] = useState("");
  const [topic, setTopic] = useState("");
  const [classification, setClassification] = useState("");
  const [strength, setStrength] = useState("");
  const [period, setPeriod] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const institutions = useMemo(() => [...new Set(sources.map((s) => s.institution))].sort(), [sources]);

  const filtered = useMemo(() => {
    return sources.filter((s) => {
      if (q && !`${s.name} ${s.institution} ${s.purpose}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (institution && s.institution !== institution) return false;
      if (legend && s.legend !== legend) return false;
      if (period && !(s.publishedAt ?? "").startsWith(period)) return false;
      // Filtros por candidato/tema/tipo/força dependem de evidências publicadas que citem a fonte.
      const ev = evidence.filter((e) => e.sourceId === s.id);
      if (candidate && !ev.some((e) => e.candidateId === candidate)) return false;
      if (topic && !ev.some((e) => e.topicId === topic)) return false;
      if (classification && !ev.some((e) => e.classification === classification)) return false;
      if (strength && !ev.some((e) => e.evidenceStrength === strength)) return false;
      return true;
    });
  }, [sources, evidence, q, institution, legend, candidate, topic, classification, strength, period]);

  const select = "field";
  const activeFilters = [institution, legend, candidate, topic, classification, strength, period].filter(Boolean).length;

  return (
    <div>
      <form className="card p-4 sm:p-5 shadow-sm grid gap-3 sm:grid-cols-2 lg:grid-cols-4" onSubmit={(e) => e.preventDefault()} aria-label="Filtros">
        <label className="flex min-w-0 flex-col gap-1 text-xs font-medium sm:col-span-2 lg:col-span-4">Buscar
          <input className={select} value={q} onChange={(e) => setQ(e.target.value)} placeholder="nome, instituição ou finalidade" />
        </label>
        <button
          type="button"
          className="sm:hidden inline-flex min-h-11 items-center justify-between rounded-xl border border-line-strong bg-surface px-3 text-sm font-medium"
          aria-expanded={showFilters}
          aria-controls="filtros-avancados"
          onClick={() => setShowFilters((v) => !v)}
        >
          <span>Filtros avançados{activeFilters ? ` (${activeFilters})` : ""}</span>
          <span aria-hidden="true" className={`transition-transform ${showFilters ? "rotate-180" : ""}`}>⌄</span>
        </button>
        <div id="filtros-avancados" className={`${showFilters ? "grid" : "hidden"} sm:grid gap-3 sm:col-span-2 lg:col-span-4 sm:grid-cols-2 lg:grid-cols-4`}>
        <label className="flex min-w-0 flex-col gap-1 text-xs font-medium">Instituição
          <select className={select} value={institution} onChange={(e) => setInstitution(e.target.value)}>
            <option value="">Todas</option>{institutions.map((i) => <option key={i}>{i}</option>)}
          </select>
        </label>
        <label className="flex min-w-0 flex-col gap-1 text-xs font-medium">Candidato
          <select className={select} value={candidate} onChange={(e) => setCandidate(e.target.value)}>
            <option value="">Todos</option>{candidates.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <label className="flex min-w-0 flex-col gap-1 text-xs font-medium">Tema
          <select className={select} value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option value="">Todos</option>{topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </label>
        <label className="flex min-w-0 flex-col gap-1 text-xs font-medium">Tipo de evidência
          <select className={select} value={classification} onChange={(e) => setClassification(e.target.value)}>
            <option value="">Todos</option>{Object.entries(EVIDENCE_CLASSIFICATION_LABELS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </label>
        <label className="flex min-w-0 flex-col gap-1 text-xs font-medium">Força da evidência
          <select className={select} value={strength} onChange={(e) => setStrength(e.target.value)}>
            <option value="">Todas</option>{Object.entries(EVIDENCE_STRENGTH_LABELS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </label>
        <label className="flex min-w-0 flex-col gap-1 text-xs font-medium">Legenda
          <select className={select} value={legend} onChange={(e) => setLegend(e.target.value)}>
            <option value="">Todas</option>{Object.entries(SOURCE_LEGEND_LABELS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </label>
        <label className="flex min-w-0 flex-col gap-1 text-xs font-medium">Período (ano de publicação)
          <input className={select} value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="ex.: 2026" inputMode="numeric" />
        </label>
        </div>
      </form>

      <p className="mt-4 text-sm font-medium text-ink-2" role="status">{filtered.length} fonte(s). {evidence.length === 0 ? "Ainda não há evidências publicadas; filtros por candidato, tema, tipo e força retornam vazio até a primeira revisão aprovada." : null}</p>

      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {filtered.map((s) => (
          <li key={s.id} className="card card-lift min-w-0 p-4 sm:p-5 flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2"><SourceLegendBadge legend={s.legend} /><span className="text-xs text-ink-3 break-all">{s.type}</span></div>
            <h2 className="font-semibold">{s.name}</h2>
            <p className="text-xs text-ink-3">{s.institution}{s.publishedAt ? ` · publicado em ${formatDate(s.publishedAt)}` : ""}</p>
            <p className="text-sm text-ink-2">{s.purpose}</p>
            {s.usageRestrictions ? <p className="text-xs text-ink-2 border-l-2 border-line-strong pl-2">{s.usageRestrictions}</p> : null}
            <div className="mt-auto flex flex-col gap-1 pt-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-2">
              <SourceLink source={s} label="Abrir origem" />
              <VerificationNote source={s} />
            </div>
            {s.verification.note ? <p className="text-xs text-ink-3">{s.verification.note}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
