import type { ProposedEvidence, SourceAdapter, FetchOptions } from "./types";

/**
 * Executa um adapter de ponta a ponta até a etapa de "evidência candidata".
 * O resultado NÃO é publicado: devolve rascunhos para a fila de revisão humana.
 */
export async function runIngestion(adapter: SourceAdapter, options: FetchOptions): Promise<ProposedEvidence[]> {
  const proposed: ProposedEvidence[] = [];
  const raws = await adapter.fetchDocuments(options);
  for (const raw of raws) {
    await adapter.saveRawDocument(raw);
    const doc = await adapter.normalizeDocument(raw);
    const meta = await adapter.extractMetadata(doc);
    const drafts = await adapter.proposeEvidence(doc, meta);
    for (const d of drafts) {
      if (d.reviewStatus !== "DRAFT") throw new Error("Adapter tentou propor evidência fora do status DRAFT.");
      proposed.push(d);
    }
  }
  return proposed;
}
