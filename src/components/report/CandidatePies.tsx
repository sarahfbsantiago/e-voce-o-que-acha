"use client";

import type { Candidate } from "@/domain/types";
import { CANDIDATE_ACTS } from "@/data/candidate-acts";
import { Donut, type Slice } from "./Donut";
import { AREA_GROUPS } from "./areaGroups";

/**
 * Atuação de cada candidato por área, medida pelo que ele FEZ: atos documentados em fontes oficiais
 * (leis, decretos, medidas provisórias e programas; para o parlamentar, projetos de sua autoria),
 * classificados por área. Promessas de programa não entram. Mesmas áreas e cores da pizza da pessoa.
 */
export function CandidatePies({ candidates }: { candidates: Candidate[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {candidates.map((c) => {
        const acts = CANDIDATE_ACTS[c.id] ?? [];
        const slices: Slice[] = AREA_GROUPS.map((g) => {
          const n = acts.filter((a) => a.area === g.id).length;
          return { id: g.id, label: g.label, value: n, color: g.color, detail: `${n} de ${acts.length} atos` };
        });
        return (
          <Donut
            key={c.id}
            slices={slices}
            caption={`Atuação de ${c.name} por área`}
            hint={c.id === "lula" ? `O que ele fez: ${acts.length} leis, decretos, medidas provisórias e programas conferidos, por área.` : `O que ele fez: ${acts.length} projetos de lei, PECs e outras proposições de sua autoria no Senado, por área.`}
            size={120}
            compact
          />
        );
      })}
    </div>
  );
}
