import type { Metadata } from "next";
import { PageTitle } from "@/components/ui";
import { getContentRepository } from "@/lib/repository";
import { SourcesCatalog } from "@/components/SourcesCatalog";
import { SourceLegendBadge } from "@/components/SourceBits";
import { SOURCE_LEGEND_LABELS, type SourceLegend } from "@/domain/types";

export const metadata: Metadata = { title: "Fontes" };

export default async function FontesPage() {
  const repo = await getContentRepository();
  const [sources, candidates, topics, evidence] = await Promise.all([
    repo.getSources(),
    repo.getCandidates(),
    repo.getTopics(),
    repo.getPublishedEvidence({}),
  ]);
  return (
    <div className="container-page py-7 md:py-16">
      <PageTitle eyebrow="Transparência" tone="mint" lead="Catálogo pesquisável de todas as fontes utilizadas. Cada fonte abre sua origem.">Fontes</PageTitle>
      <details className="card p-5 mb-6 text-sm shadow-sm">
        <summary className="font-semibold">Legendas de fonte</summary>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {(Object.keys(SOURCE_LEGEND_LABELS) as SourceLegend[]).map((k) => (
            <li key={k} className="flex flex-wrap items-center gap-2 text-ink-2"><SourceLegendBadge legend={k} /><span>{SOURCE_LEGEND_LABELS[k].meaning}</span></li>
          ))}
        </ul>
      </details>
      <SourcesCatalog sources={sources} candidates={candidates} topics={topics} evidence={evidence} />
    </div>
  );
}

export const dynamic = "force-dynamic";
