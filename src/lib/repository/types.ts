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
import type { FeedbackLike, SubmissionLike } from "@/domain/aggregates";
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

/** Estatísticas anônimas. Estrutura separada do conteúdo. */
export interface StatsRepository {
  readonly enabled: boolean;
  saveSubmission(input: SubmissionInput): Promise<{ id: string }>;
  listSubmissions(): Promise<SubmissionLike[]>;
  countSubmissions(): Promise<number>;
  saveFeedback(input: FeedbackInput): Promise<{ id: string }>;
  listFeedback(): Promise<FeedbackLike[]>;
}
