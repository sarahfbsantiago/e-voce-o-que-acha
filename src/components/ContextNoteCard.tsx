import type { ContextNote, SourceRegistryEntry } from "@/domain/types";
import { formatDate } from "@/lib/format";
import { SourceLegendBadge, SourceLink } from "./SourceBits";

const KIND_LABEL = { LEGAL: "Situação legal vigente", CONCEPTUAL: "Contexto conceitual", HISTORICAL: "Contexto histórico" };

export function ContextNoteCard({ note, sources }: { note: ContextNote; sources: Record<string, SourceRegistryEntry> }) {
  return (
    <aside className="rounded-xl border border-note-line bg-note p-4 md:p-5" aria-label={note.title}>
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">
        {KIND_LABEL[note.kind]} · vigente em {formatDate(note.asOf)}
      </p>
      <h3 className="mt-1 font-semibold">{note.title}</h3>
      <div className="mt-2 space-y-2 text-sm text-ink-2">
        {note.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {note.timeline?.length ? (
        <ol className="mt-4 border-l-2 border-line-strong pl-4 space-y-2">
          {note.timeline.map((ev, i) => {
            const s = sources[ev.sourceId];
            return (
              <li key={i} className="text-sm">
                <span className="font-semibold">{formatDate(ev.date)}</span> — {ev.text}{" "}
                {s ? <SourceLink source={s} label={`Fonte: ${s.name}`} /> : null}
              </li>
            );
          })}
        </ol>
      ) : null}
      {note.sourceIds.length ? (
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          {note.sourceIds.map((id) => {
            const s = sources[id];
            if (!s) return null;
            return (
              <li key={id} className="flex flex-wrap items-center gap-2 text-sm">
                <SourceLegendBadge legend={s.legend} />
                <SourceLink source={s} label={s.name} />
              </li>
            );
          })}
        </ul>
      ) : null}
    </aside>
  );
}
