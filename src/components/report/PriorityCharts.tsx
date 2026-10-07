import type { TopicSection } from "@/domain/user-summary";

/**
 * Gráfico de barras (HTML) sobre as respostas do próprio usuário.
 * Nada aqui envolve candidatos: é o mapa de prioridades e a cobertura das respostas por tema.
 * Um matiz só para magnitude (importância); cinza neutro para "não sei"; vazio para sem resposta.
 */
export function PriorityCharts({ sections }: { sections: TopicSection[] }) {
  return (
    <div className="grid gap-4">
      <figure className="card p-5">
        <figcaption className="text-sm font-semibold">Como você respondeu em cada tema</figcaption>
        <p className="mt-0.5 text-xs text-ink-3">Perguntas com opinião, “não sei” e sem resposta.</p>
        <ol className="mt-4 space-y-2.5">
          {sections.map((s) => {
            const withOpinion = s.answered - s.noOpinion;
            const missing = s.total - s.answered;
            const seg = (n: number) => `${(n / Math.max(1, s.total)) * 100}%`;
            return (
              <li key={s.topic.id} className="grid grid-cols-[minmax(0,13rem)_1fr] items-center gap-3 text-sm" title={`${s.topic.name}: ${withOpinion} com opinião, ${s.noOpinion} “não sei”, ${missing} sem resposta`}>
                <span className="text-ink-2 leading-snug">{s.topic.name}</span>
                <span className="flex items-center gap-2">
                  <span className="flex h-3 flex-1 gap-0.5 overflow-hidden rounded-r bg-line/60" aria-hidden="true">
                    {withOpinion > 0 ? <span className="h-full bg-accent" style={{ width: seg(withOpinion) }} /> : null}
                    {s.noOpinion > 0 ? <span className="h-full bg-ink-3/70" style={{ width: seg(s.noOpinion) }} /> : null}
                  </span>
                  <span className="w-28 shrink-0 text-xs text-ink-3">{s.answered}/{s.total}</span>
                </span>
              </li>
            );
          })}
        </ol>
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-2" aria-label="Legenda">
          <li className="flex items-center gap-1.5"><span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-sm bg-accent" />com opinião</li>
          <li className="flex items-center gap-1.5"><span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-sm bg-ink-3/70" />“não sei”</li>
          <li className="flex items-center gap-1.5"><span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-sm bg-line" />sem resposta</li>
        </ul>
      </figure>
    </div>
  );
}
