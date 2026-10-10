import { aggregateFeedback } from "@/domain/aggregates";
import { ARGUMENT_SETS } from "@/data/arguments";
import { CANDIDATES } from "@/data/candidates";
import { CANDIDATE_PROFILES } from "@/data/candidate-profiles";
import { CONTEXT_NOTES } from "@/data/context-notes";
import { METHODOLOGY_VERSIONS } from "@/data/methodology";
import { QUESTIONS } from "@/data/questions";
import { RESEARCH_PROTOCOLS } from "@/data/research-protocols";
import { SOURCE_REGISTRY } from "@/data/source-registry";
import { TOPICS } from "@/data/topics";
import type { ContentRepository, StatsRepository } from "./types";
import { StatsUnavailableError } from "./types";

/**
 * Repositório estático: conteúdo vem dos arquivos em src/data.
 * Posições, evidências e resumos de programa são vazios por definição —
 * em modo estático não existe revisão humana registrada.
 */
export const staticContentRepository: ContentRepository = {
  mode: "static",
  async getTopics() {
    return [...TOPICS].sort((a, b) => a.order - b.order);
  },
  async getQuestions() {
    return QUESTIONS;
  },
  async getQuestion(id) {
    return QUESTIONS.find((q) => q.id === id) ?? null;
  },
  async getCandidates() {
    return CANDIDATES;
  },
  async getCandidate(id) {
    return CANDIDATES.find((c) => c.id === id || c.slug === id) ?? null;
  },
  async getCandidateProfiles() {
    return CANDIDATE_PROFILES;
  },
  async getPublishedPositions() {
    return [];
  },
  async getPublishedEvidence() {
    return [];
  },
  async getPublishedProgramSummaries() {
    return [];
  },
  async getSources() {
    return SOURCE_REGISTRY;
  },
  async getSource(id) {
    return SOURCE_REGISTRY.find((s) => s.id === id) ?? null;
  },
  async getMethodologyVersions() {
    return METHODOLOGY_VERSIONS;
  },
  async getResearchProtocols() {
    return RESEARCH_PROTOCOLS;
  },
  async getContextNotes() {
    return CONTEXT_NOTES;
  },
  async getArgumentSets() {
    return ARGUMENT_SETS;
  },
};

export const disabledStatsRepository: StatsRepository = {
  enabled: false,
  async saveSubmission() {
    throw new StatsUnavailableError();
  },
  async listSubmissionsAfter() {
    return [];
  },
  async listRecentSubmissions() {
    return [];
  },
  async countSubmissions() {
    return 0;
  },
  async saveFeedback() {
    throw new StatsUnavailableError();
  },
  async feedbackSummary() {
    return aggregateFeedback([]);
  },
};
