import type { ArgumentSet } from "@/domain/types";

/** "Entenda os argumentos": argumentos do debate público, não fatos. Sem indicar qual é melhor. */
export function ArgumentsDisclosure({ set }: { set: ArgumentSet }) {
  return (
    <details className="card p-4">
      <summary className="font-semibold text-accent">Entenda os argumentos</summary>
      <p className="mt-2 text-xs text-ink-3">
        Possíveis argumentos utilizados no debate público sobre: <strong className="text-ink-2">{set.policy}</strong>. São argumentos,
        não fatos estabelecidos. Este site não informa qual argumento é melhor.
      </p>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <div>
          <h4 className="text-sm font-semibold">Possíveis argumentos favoráveis</h4>
          <ul className="mt-1 list-disc pl-5 text-sm text-ink-2 space-y-1">
            {set.inFavor.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Possíveis argumentos contrários</h4>
          <ul className="mt-1 list-disc pl-5 text-sm text-ink-2 space-y-1">
            {set.against.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </div>
      </div>
    </details>
  );
}
