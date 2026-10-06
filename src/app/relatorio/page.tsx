import type { Metadata } from "next";
import { getContentRepository } from "@/lib/repository";
import { ReportView } from "@/components/report/ReportView";

export const metadata: Metadata = { title: "Seu mapa de prioridades" };
export const dynamic = "force-dynamic";

export default async function RelatorioPage() {
  const repo = await getContentRepository();
  const [candidates, positions, evidence, summaries, sources, profiles] = await Promise.all([
    repo.getCandidates(),
    repo.getPublishedPositions(),
    repo.getPublishedEvidence({}),
    repo.getPublishedProgramSummaries(),
    repo.getSources(),
    repo.getCandidateProfiles(),
  ]);
  return <ReportView candidates={candidates} positions={positions} evidence={evidence} summaries={summaries} sources={sources} profiles={profiles} />;
}
