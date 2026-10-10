import type {
  ArgumentSet,
  Candidate,
  CandidatePosition,
  CandidateProfile,
  ContextNote,
  Evidence,
  MethodologyVersion,
  ProgramSummary,
  Question,
  ResearchProtocol,
  SourceRegistryEntry,
  Topic,
} from "@/domain/types";
import type { FeedbackAggregate, SubmissionLike } from "@/domain/aggregates";
import type { FeedbackInput, SubmissionInput } from "@/lib/validation";

/**
 * Camada de acesso a conteúdo. Toda leitura pública passa por aqui, e só
 * registros PUBLISHED são retornados pelos métodos `getPublished*`.
 */
export interface ContentRepository {
  readonly mode: "static" | "prisma";
  getTopics(): Promise<Topic[]>;
  getQuestions(): Promise<Question[]>;
  getQuestion(id: string): Promise<Question | null>;
  getCandidates(): Promise<Candidate[]>;
  getCandidate(id: string): Promise<Candidate | null>;
  getCandidateProfiles(): Promise<CandidateProfile[]>;
  getPublishedPositions(candidateId?: string): Promise<CandidatePosition[]>;
  getPublishedEvidence(filter: { questionId?: string; candidateId?: string }): Promise<Evidence[]>;
  getPublishedProgramSummaries(): Promise<ProgramSummary[]>;
  getSources(): Promise<SourceRegistryEntry[]>;
  getSource(id: string): Promise<SourceRegistryEntry | null>;
  getMethodologyVersions(): Promise<MethodologyVersion[]>;
  getResearchProtocols(): Promise<ResearchProtocol[]>;
  getContextNotes(): Promise<ContextNote[]>;
  getArgumentSets(): Promise<ArgumentSet[]>;
}

export class StatsUnavailableError extends Error {
  constructor() {
    super("Estatísticas indisponíveis: banco de dados não configurado.");
    this.name = "StatsUnavailableError";
  }
}

export interface SubmissionCursor { at: string; id: string }

/** Estatísticas anônimas. Estrutura separada do conteúdo. */
export interface StatsRepository {
  readonly enabled: boolean;
  saveSubmission(input: SubmissionInput): Promise<{ id: string }>;
  /** Lote de envios depois do cursor (ordem: submittedAt, id). Nunca carrega a tabela inteira. */
  listSubmissionsAfter(cursor: SubmissionCursor | null, take: number): Promise<SubmissionLike[]>;
  /** Os envios mais recentes (amostra para impacto e prévia). */
  listRecentSubmissions(take: number): Promise<SubmissionLike[]>;
  countSubmissions(): Promise<number>;
  saveFeedback(input: FeedbackInput): Promise<{ id: string }>;
  /** Avaliações somadas no próprio banco. */
  feedbackSummary(): Promise<FeedbackAggregate>;
}
