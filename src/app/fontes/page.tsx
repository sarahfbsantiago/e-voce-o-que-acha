import type { Metadata } from "next";
import { PageTitle } from "@/components/ui";
import { getContentRepository } from "@/lib/repository";
import { SourcesCatalog } from "@/components/SourcesCatalog";

export const metadata: Metadata = { title: "Fontes" };

export default async function FontesPage() {
  const repo = await getContentRepository();
  const sources = await repo.getSources();
  return (
    <div className="container-page py-7 md:py-16">
      <PageTitle eyebrow="Transparência" tone="mint" lead="Todas as fontes utilizadas no site. Cada fonte abre sua origem.">Fontes</PageTitle>
      <SourcesCatalog sources={sources} />
    </div>
  );
}

export const dynamic = "force-dynamic";
