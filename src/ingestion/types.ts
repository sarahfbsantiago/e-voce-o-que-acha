import type { EvidenceClassification, EvidenceStrength, SourceType } from "@/domain/types";

/**
 * Arquitetura de ingestão.
 *
 * Fluxo obrigatório:
 *   fonte externa → documento bruto → normalização → extração preliminar →
 *   evidência candidata (DRAFT) → revisão humana → aprovação → publicação.
 *
 * Nenhuma importação automática vira evidência publicada. Nenhum adapter
 * escreve em CandidatePosition. O documento bruto é preservado sempre que
 * permitido.
 */

export interface RawDocument {
  sourceId: string;
  adapter: string;
  externalId?: string;
  url: string;
  fetchedAt: string;
  contentType?: string;
  content?: string;
  hash?: string;
  metadata?: Record<string, unknown>;
}

export interface NormalizedDocument {
  raw: RawDocument;
  title: string;
  text: string;
  documentDate: string | null;
  authors: string[];
  sourceType: SourceType;
}

export interface ExtractedMetadata {
  candidateIdHints: string[];
  topicIdHints: string[];
  questionIdHints: string[];
  keywordsMatched: string[];
}

/** Evidência candidata: sempre nasce como DRAFT e aguarda revisão humana. */
export interface ProposedEvidence {
  candidateId: string | null;
  questionId: string | null;
  topicId: string | null;
  title: string;
  summary: string;
  originalExcerpt: string;
  sourceId: string;
  sourceType: SourceType;
  eventDate: string | null;
  publicationDate: string | null;
  retrievedAt: string;
  suggestedClassification: EvidenceClassification | null;
  suggestedStrength: EvidenceStrength | null;
  reviewStatus: "DRAFT";
  rawDocumentRef: string;
}

export interface FetchOptions {
  since?: string;
  until?: string;
  searchTerms?: string[];
  limit?: number;
}

export interface SourceAdapter {
  readonly id: string;
  readonly sourceId: string;
  fetchDocuments(options: FetchOptions): Promise<RawDocument[]>;
  normalizeDocument(raw: RawDocument): Promise<NormalizedDocument>;
  extractMetadata(doc: NormalizedDocument): Promise<ExtractedMetadata>;
  saveRawDocument(raw: RawDocument): Promise<{ id: string }>;
  proposeEvidence(doc: NormalizedDocument, meta: ExtractedMetadata): Promise<ProposedEvidence[]>;
}
