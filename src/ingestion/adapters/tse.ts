import type { ExtractedMetadata, FetchOptions, NormalizedDocument, ProposedEvidence, RawDocument, SourceAdapter } from "../types";

/**
 * Adapter para os planos de governo registrados no TSE (DivulgaCandContas).
 *
 * TODO(ingestão): o portal bloqueia acesso automatizado (403). Confirmar a URL
 * canônica dos planos de 2026 e o formato (PDF) dos documentos; preservar o PDF
 * bruto e seu hash em RawDocument.
 */
export class TseAdapter implements SourceAdapter {
  readonly id = "tse-planos-2026";
  readonly sourceId = "tse-planos-2026";

  async fetchDocuments(_options: FetchOptions): Promise<RawDocument[]> {
    void _options;
    return [];
  }
  async normalizeDocument(raw: RawDocument): Promise<NormalizedDocument> {
    return { raw, title: "Plano de governo", text: raw.content ?? "", documentDate: null, authors: [], sourceType: "government_plan" };
  }
  async extractMetadata(): Promise<ExtractedMetadata> {
    return { candidateIdHints: [], topicIdHints: [], questionIdHints: [], keywordsMatched: [] };
  }
  async saveRawDocument(raw: RawDocument): Promise<{ id: string }> {
    return { id: `${raw.adapter}:${raw.externalId ?? raw.url}` };
  }
  async proposeEvidence(): Promise<ProposedEvidence[]> {
    return [];
  }
}
