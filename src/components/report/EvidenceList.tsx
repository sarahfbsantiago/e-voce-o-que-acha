import type { Evidence, Question, SourceRegistryEntry } from "@/domain/types";
import { EVIDENCE_CLASSIFICATION_LABELS, EVIDENCE_STRENGTH_LABELS } from "@/domain/types";
import { SourceLegendBadge, SourceLink } from "@/components/SourceBits";
import { formatDate } from "@/lib/format";

/**
 * Lista de evidências PUBLICADAS para um candidato em uma questão, agrupadas por
 * classificação (proposta, posição, atuação, resultado observado). Cada item tem
 * "Ver fonte original" e "Por que estou vendo isso?".
 */
export function EvidenceList({ evidence, question, answerLabels, sourceById }: { evidence: Evidence[]; question: Question; answerLabels: string[]; sourceById: Record<string, SourceRegistryEntry> }) {
  if (evidence.length === 0) return null;
  const groups = (["PROPOSTA", "POSICAO", "ATUACAO", "RESULTADO_OBSERVADO"] as const).map((k) => ({ key: k, items: evidence.filter((e) => e.classification === k) })).filter((g) => g.items.length);
  return (
    <div className="mt-2 space-y-3">
      {groups.map((g) => (
        <div key={g.key}>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">{EVIDENCE_CLASSIFICATION_LABELS[g.key].label}</p>
          <ul className="mt-1 space-y-2">
            {g.items.map((e) => {
              const src = sourceById[e.sourceId];
              return (
                <li key={e.id} className="rounded-md border border-line p-2 text-sm">
                  <p className="font-medium">{e.title}</p>
                  <p className="text-ink-2">{e.summary}</p>
                  {g.key === "RESULTADO_OBSERVADO" ? <p className="text-xs text-ink-3 mt-1">Indicador observado no período indicado. Não implica causalidade.</p> : null}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {src ? <SourceLegendBadge legend={src.legend} /> : null}
                    <span className="text-xs text-ink-3">{EVIDENCE_STRENGTH_LABELS[e.evidenceStrength].label}</span>
                    {src ? <SourceLink source={src} /> : null}
                  </div>
                  <details className="mt-2">
                    <summary className="text-xs text-accent font-medium">Por que estou vendo isso?</summary>
                    <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs text-ink-2">
                      <dt className="font-semibold">Pergunta relacionada</dt><dd>{question.text}</dd>
                      <dt className="font-semibold">Sua resposta</dt><dd>{answerLabels.join("; ") || "—"}</dd>
                      <dt className="font-semibold">Documento utilizado</dt><dd>{src?.name ?? e.sourceId}</dd>
                      <dt className="font-semibold">Trecho relevante</dt><dd><q>{e.originalExcerpt}</q></dd>
                      <dt className="font-semibold">Instituição responsável</dt><dd>{src?.institution ?? "—"}</dd>
                      <dt className="font-semibold">Tipo de evidência</dt><dd>{EVIDENCE_CLASSIFICATION_LABELS[e.classification].label} · {e.sourceType}</dd>
                      <dt className="font-semibold">Data do documento</dt><dd>{formatDate(e.eventDate ?? e.publicationDate)}</dd>
                      <dt className="font-semibold">Data de consulta</dt><dd>{formatDate(e.retrievedAt)}</dd>
                      <dt className="font-semibold">Classificação</dt><dd>{EVIDENCE_STRENGTH_LABELS[e.evidenceStrength].label}</dd>
                      <dt className="font-semibold">Critério da classificação</dt><dd>{e.classificationCriterion ?? "—"}</dd>
                      <dt className="font-semibold">Link original</dt><dd>{src ? <a className="underline" href={src.documentUrl ?? src.url} target="_blank" rel="noopener noreferrer">{src.documentUrl ?? src.url}</a> : "—"}</dd>
                    </dl>
                  </details>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
