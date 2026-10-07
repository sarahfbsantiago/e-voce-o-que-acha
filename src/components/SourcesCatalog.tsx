import type { SourceRegistryEntry } from "@/domain/types";
import { SourceLegendBadge, SourceLink, VerificationNote } from "./SourceBits";
import { formatDate } from "@/lib/format";

/** Lista simples de todas as fontes usadas no site, sem busca nem filtros. */
export function SourcesCatalog({ sources }: { sources: SourceRegistryEntry[] }) {
  return (
    <div>
      <p className="text-sm font-medium text-ink-2">{sources.length} fontes</p>
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {sources.map((s) => (
          <li key={s.id} className="card card-lift min-w-0 p-4 sm:p-5 flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2"><SourceLegendBadge legend={s.legend} /></div>
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
