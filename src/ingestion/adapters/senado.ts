import type { ExtractedMetadata, FetchOptions, NormalizedDocument, ProposedEvidence, RawDocument, SourceAdapter } from "../types";

/**
 * Adapter para os Dados Abertos do Senado Federal.
 * Documentação: https://legis.senado.leg.br/dadosabertos/docs/
 *
 * TODO(ingestão): implementar consultas de matérias por autor (código parlamentar),
 * votações nominais e pronunciamentos.
 */
export class SenadoAdapter implements SourceAdapter {
  readonly id = "senado-dados-abertos";
  readonly sourceId = "senado-dados-abertos";

  async fetchDocuments(_options: FetchOptions): Promise<RawDocument[]> {
    void _options;
    // TODO(ingestão): GET https://legis.senado.leg.br/dadosabertos/senador/{codigo}/autorias
    return [];
  }
  async normalizeDocument(raw: RawDocument): Promise<NormalizedDocument> {
    return { raw, title: "", text: raw.content ?? "", documentDate: null, authors: [], sourceType: "bill" };
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
