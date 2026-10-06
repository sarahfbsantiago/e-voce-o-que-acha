import type { ExtractedMetadata, FetchOptions, NormalizedDocument, ProposedEvidence, RawDocument, SourceAdapter } from "../types";

/**
 * Adapter para a API Dados Abertos da Câmara dos Deputados.
 * Documentação: https://dadosabertos.camara.leg.br/swagger/api.html
 *
 * TODO(ingestão): implementar chamadas reais a /proposicoes, /proposicoes/{id}/autores,
 * /proposicoes/{id}/tramitacoes, /votacoes e /votacoes/{id}/votos.
 * TODO(ingestão): persistir RawDocument via Prisma.
 */
export const CAMARA_API_BASE = "https://dadosabertos.camara.leg.br/api/v2";

export class CamaraAdapter implements SourceAdapter {
  readonly id = "camara-dados-abertos";
  readonly sourceId = "camara-dados-abertos";

  async fetchDocuments(options: FetchOptions): Promise<RawDocument[]> {
    const params = new URLSearchParams({ itens: String(options.limit ?? 20), ordem: "DESC", ordenarPor: "id" });
    if (options.searchTerms?.length) params.set("keywords", options.searchTerms.join(","));
    if (options.since) params.set("dataApresentacaoInicio", options.since);
    if (options.until) params.set("dataApresentacaoFim", options.until);
    const url = `${CAMARA_API_BASE}/proposicoes?${params.toString()}`;
    const res = await fetch(url, { headers: { accept: "application/json" } });
    if (!res.ok) throw new Error(`Câmara API ${res.status}`);
    const json = (await res.json()) as { dados: Array<{ id: number; uri: string; ementa: string; siglaTipo: string; numero: number; ano: number }> };
    const fetchedAt = new Date().toISOString();
    return json.dados.map((d) => ({
      sourceId: this.sourceId,
      adapter: this.id,
      externalId: String(d.id),
      url: d.uri,
      fetchedAt,
      contentType: "application/json",
      content: JSON.stringify(d),
      metadata: { siglaTipo: d.siglaTipo, numero: d.numero, ano: d.ano },
    }));
  }

  async normalizeDocument(raw: RawDocument): Promise<NormalizedDocument> {
    const d = raw.content ? (JSON.parse(raw.content) as { ementa?: string; siglaTipo?: string; numero?: number; ano?: number }) : {};
    return {
      raw,
      title: `${d.siglaTipo ?? ""} ${d.numero ?? ""}/${d.ano ?? ""}`.trim(),
      text: d.ementa ?? "",
      documentDate: d.ano ? `${d.ano}-01-01` : null,
      authors: [], // TODO(ingestão): buscar /proposicoes/{id}/autores
      sourceType: "bill",
    };
  }

  async extractMetadata(doc: NormalizedDocument): Promise<ExtractedMetadata> {
    return { candidateIdHints: [], topicIdHints: [], questionIdHints: [], keywordsMatched: [doc.title].filter(Boolean) };
  }

  async saveRawDocument(raw: RawDocument): Promise<{ id: string }> {
    // TODO(ingestão): persistir em RawDocument (Prisma). Em modo estático, apenas devolve um id derivado.
    return { id: `${raw.adapter}:${raw.externalId ?? raw.url}` };
  }

  async proposeEvidence(doc: NormalizedDocument, meta: ExtractedMetadata): Promise<ProposedEvidence[]> {
    // Sem autoria confirmada não há evidência candidata: critério de inclusão.
    if (meta.candidateIdHints.length === 0) return [];
    return meta.candidateIdHints.map((candidateId) => ({
      candidateId,
      questionId: meta.questionIdHints[0] ?? null,
      topicId: meta.topicIdHints[0] ?? null,
      title: doc.title,
      summary: doc.text,
      originalExcerpt: doc.text,
      sourceId: this.sourceId,
      sourceType: doc.sourceType,
      eventDate: doc.documentDate,
      publicationDate: doc.documentDate,
      retrievedAt: doc.raw.fetchedAt,
      suggestedClassification: "ATUACAO",
      suggestedStrength: "A",
      reviewStatus: "DRAFT",
      rawDocumentRef: `${doc.raw.adapter}:${doc.raw.externalId ?? doc.raw.url}`,
    }));
  }
}
