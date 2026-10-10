import { SOURCE_REGISTRY } from "@/data/source-registry";
import { EVIDENCE_OVERRIDES, POSITION_OVERRIDES, evidenceSummaryWith } from "@/data/position-overrides";
import { CANDIDATE_PROFILES } from "@/data/candidate-profiles";
import type { Prisma } from "@prisma/client";
import type {
  AgeRange,
  ArgumentSet,
  Candidate,
  CandidatePosition,
  CandidateProfile,
  ContextNote,
  Evidence,
  MethodologyVersion,
  ProgramSummary,
  Question,
  Region,
  ResearchProtocol,
  SourceRegistryEntry,
  Topic,
  TopicPriority,
  UserAnswer,
} from "@/domain/types";
import type { FeedbackLike, SubmissionLike } from "@/domain/aggregates";
import { getPrisma } from "@/lib/prisma";
import type { FeedbackInput, SubmissionInput } from "@/lib/validation";
import type { ContentRepository, StatsRepository } from "./types";

const iso = (d: Date | null | undefined) => (d ? d.toISOString().slice(0, 10) : null);

// Mapeamento de enums de demografia (domínio <-> Prisma)
const AGE_TO_DB: Record<AgeRange, Prisma.SurveySubmissionCreateInput["optionalAgeRange"]> = {
  "16-24": "R16_24",
  "25-34": "R25_34",
  "35-44": "R35_44",
  "45-59": "R45_59",
  "60+": "R60_PLUS",
  "prefiro-nao-responder": "PREFER_NOT",
};
const AGE_FROM_DB: Record<string, AgeRange> = Object.fromEntries(Object.entries(AGE_TO_DB).map(([k, v]) => [v as string, k as AgeRange]));

const REGION_TO_DB: Record<Region, Prisma.SurveySubmissionCreateInput["optionalRegion"]> = {
  norte: "NORTE",
  nordeste: "NORDESTE",
  "centro-oeste": "CENTRO_OESTE",
  sudeste: "SUDESTE",
  sul: "SUL",
  exterior: "EXTERIOR",
  "prefiro-nao-responder": "PREFER_NOT",
};
const REGION_FROM_DB: Record<string, Region> = Object.fromEntries(Object.entries(REGION_TO_DB).map(([k, v]) => [v as string, k as Region]));

export const prismaContentRepository: ContentRepository = {
  mode: "prisma",

  async getTopics(): Promise<Topic[]> {
    const rows = await getPrisma().topic.findMany({ orderBy: { order: "asc" } });
    return rows.map((t) => ({ id: t.id, slug: t.slug, order: t.order, name: t.name, description: t.description, subtopics: t.subtopics, priorityQuestion: t.priorityQuestion ?? undefined }));
  },

  async getQuestions(): Promise<Question[]> {
    const rows = await getPrisma().question.findMany({
      include: { options: { orderBy: { order: "asc" } }, topic: true },
      orderBy: [{ topic: { order: "asc" } }, { order: "asc" }],
    });
    return rows.map(mapQuestion);
  },

  async getQuestion(id) {
    const row = await getPrisma().question.findUnique({ where: { id }, include: { options: { orderBy: { order: "asc" } } } });
    return row ? mapQuestion(row) : null;
  },

  async getCandidates(): Promise<Candidate[]> {
    const rows = await getPrisma().candidate.findMany({ orderBy: { id: "asc" } });
    return rows.map((c) => ({ id: c.id, slug: c.slug, name: c.name, roleContext: c.roleContext, historySourceIds: c.historySourceIds }));
  },

  async getCandidate(id) {
    const c = await getPrisma().candidate.findFirst({ where: { OR: [{ id }, { slug: id }] } });
    return c ? { id: c.id, slug: c.slug, name: c.name, roleContext: c.roleContext, historySourceIds: c.historySourceIds } : null;
  },

  async getCandidateProfiles(): Promise<CandidateProfile[]> {
    // Currículos editáveis no admin: vale a versão publicada (configuração viva), não a cópia do seed.
    return JSON.parse(JSON.stringify(CANDIDATE_PROFILES)) as CandidateProfile[];
  },

  async getPublishedPositions(candidateId?: string): Promise<CandidatePosition[]> {
    // Ajustes publicados pelo admin (Revisão de posições) valem por cima do banco, inclusive o status.
    const rows = await getPrisma().candidatePosition.findMany({
      where: candidateId ? { candidateId } : {},
      include: { evidences: true },
    });
    return rows.map((p) => {
      const o = POSITION_OVERRIDES[`${p.questionId}|${p.candidateId}`] ?? {};
      return {
        id: p.id,
        candidateId: p.candidateId,
        questionId: p.questionId,
        direction: (o.direction ?? p.direction) as CandidatePosition["direction"],
        closestOptionId: o.closestOptionId !== undefined ? o.closestOptionId : p.closestOptionId,
        summary: o.summary ?? p.summary,
        dimension: p.dimension ?? undefined,
        evidenceIds: p.evidences.map((e) => e.evidenceId),
        reviewStatus: (o.reviewStatus ?? p.reviewStatus) as CandidatePosition["reviewStatus"],
        timeline: (p.timeline as unknown as CandidatePosition["timeline"]) ?? undefined,
        updatedAt: p.updatedAt.toISOString(),
      };
    }).filter((p) => p.reviewStatus === "PUBLISHED");
  },

  async getPublishedEvidence(filter): Promise<Evidence[]> {
    const rows = await getPrisma().evidence.findMany({
      where: {
        reviewStatus: "PUBLISHED",
        ...(filter.questionId ? { questionId: filter.questionId } : {}),
        ...(filter.candidateId ? { candidateId: filter.candidateId } : {}),
      },
      orderBy: { eventDate: "desc" },
    });
    return rows.map((e) => ({
      id: e.id,
      candidateId: e.candidateId,
      questionId: e.questionId,
      topicId: e.topicId,
      title: EVIDENCE_OVERRIDES[e.id]?.title ?? e.title,
      summary: evidenceSummaryWith(e.summary, EVIDENCE_OVERRIDES[e.id]),
      originalExcerpt: EVIDENCE_OVERRIDES[e.id]?.originalExcerpt ?? e.originalExcerpt,
      sourceId: e.sourceId,
      sourceType: e.sourceType,
      eventDate: iso(e.eventDate),
      publicationDate: iso(e.publicationDate),
      retrievedAt: e.retrievedAt.toISOString(),
      classification: e.classification,
      evidenceStrength: e.evidenceStrength,
      reviewStatus: e.reviewStatus,
      classificationCriterion: e.classificationCriterion ?? undefined,
      inForce: e.inForce,
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
    }));
  },

  async getPublishedProgramSummaries(): Promise<ProgramSummary[]> {
    const rows = await getPrisma().programSummary.findMany({ where: { reviewStatus: "PUBLISHED" } });
    return rows.map((s) => ({
      id: s.id,
      candidateId: s.candidateId,
      themeKey: s.themeKey,
      title: s.title,
      summary: s.summary,
      documentalStatus: s.documentalStatus,
      actionLabel: s.actionLabel,
      sourceId: s.sourceId,
      documentDate: iso(s.documentDate),
      proposalDetails: (s.proposalDetails as unknown as ProgramSummary["proposalDetails"]) ?? undefined,
      reviewStatus: s.reviewStatus,
    }));
  },

  // Fontes editáveis no admin: vale a versão publicada (configuração viva); o banco é a cópia do seed.
  async getSources(): Promise<SourceRegistryEntry[]> {
    return [...SOURCE_REGISTRY].sort((a, b) => a.institution.localeCompare(b.institution, "pt-BR"));
  },

  async getSource(id) {
    return SOURCE_REGISTRY.find((s) => s.id === id) ?? null;
  },

  async getMethodologyVersions(): Promise<MethodologyVersion[]> {
    const rows = await getPrisma().methodologyVersion.findMany({ orderBy: { effectiveFrom: "asc" } });
    return rows.map((m) => ({
      id: m.id,
      version: m.version,
      title: m.title,
      description: m.description,
      effectiveFrom: iso(m.effectiveFrom)!,
      effectiveUntil: iso(m.effectiveUntil),
      createdAt: m.createdAt.toISOString(),
      changeLog: m.changeLog,
    }));
  },

  async getResearchProtocols(): Promise<ResearchProtocol[]> {
    const rows = await getPrisma().researchProtocol.findMany();
    return rows.map((p) => ({
      id: p.id,
      questionId: p.questionId,
      topic: p.topic,
      subtopic: p.subtopic,
      searchTerms: p.searchTerms,
      sourceIds: p.sourceIds,
      period: p.period,
      inclusionCriteria: p.inclusionCriteria,
      exclusionCriteria: p.exclusionCriteria,
      definedAt: iso(p.definedAt)!,
    }));
  },

  async getContextNotes(): Promise<ContextNote[]> {
    const rows = await getPrisma().contextNote.findMany();
    return rows.map((n) => ({
      id: n.id,
      kind: n.kind,
      title: n.title,
      paragraphs: n.paragraphs,
      sourceIds: n.sourceIds,
      asOf: iso(n.asOf)!,
      timeline: (n.timeline as unknown as ContextNote["timeline"]) ?? undefined,
    }));
  },

  async getArgumentSets(): Promise<ArgumentSet[]> {
    const rows = await getPrisma().argumentSet.findMany();
    return rows.map((a) => ({ id: a.id, policy: a.policy, inFavor: a.inFavor, against: a.against }));
  },
};

type QuestionRow = Prisma.QuestionGetPayload<{ include: { options: true } }>;

function mapQuestion(q: QuestionRow): Question {
  return {
    id: q.id,
    topicId: q.topicId,
    subtopic: q.subtopic ?? undefined,
    order: q.order,
    text: q.text,
    kind: q.kind,
    options: q.options.map((o) => ({ id: o.id, label: o.label, order: o.order, normalizedValue: o.normalizedValue, isNoOpinion: o.isNoOpinion })),
    contextNoteIds: q.contextNoteIds.length ? q.contextNoteIds : undefined,
    argumentsId: q.argumentsId ?? undefined,
    evidenceDistinctions: q.evidenceDistinctions.length ? q.evidenceDistinctions : undefined,
  };
}



export const prismaStatsRepository: StatsRepository = {
  enabled: true,

  async saveSubmission(input: SubmissionInput) {
    const row = await getPrisma().surveySubmission.create({
      data: {
        methodologyVersion: input.methodologyVersion,
        answers: input.answers,
        topicPriorities: input.topicPriorities,
        optionalAgeRange: input.optionalAgeRange ? AGE_TO_DB[input.optionalAgeRange] : null,
        optionalRegion: input.optionalRegion ? REGION_TO_DB[input.optionalRegion] : null,
      },
      select: { id: true },
    });
    // Atualiza agregados por pergunta/alternativa.
    for (const a of input.answers) {
      for (const optionId of a.optionIds) {
        await getPrisma().questionAggregate.upsert({
          where: { questionId_optionId_methodologyVersion: { questionId: a.questionId, optionId, methodologyVersion: input.methodologyVersion } },
          create: { questionId: a.questionId, optionId, methodologyVersion: input.methodologyVersion, responseCount: 1 },
          update: { responseCount: { increment: 1 }, calculatedAt: new Date() },
        });
      }
    }
    return { id: row.id };
  },

  async listSubmissions(): Promise<SubmissionLike[]> {
    const rows = await getPrisma().surveySubmission.findMany({ orderBy: { submittedAt: "asc" } });
    return rows.map((r) => ({
      id: r.id,
      submittedAt: r.submittedAt.toISOString(),
      methodologyVersion: r.methodologyVersion,
      answers: r.answers as unknown as UserAnswer[],
      topicPriorities: r.topicPriorities as unknown as TopicPriority[],
      optionalAgeRange: r.optionalAgeRange ? AGE_FROM_DB[r.optionalAgeRange] : null,
      optionalRegion: r.optionalRegion ? REGION_FROM_DB[r.optionalRegion] : null,
    }));
  },

  async countSubmissions() {
    return getPrisma().surveySubmission.count();
  },

  async saveFeedback(input: FeedbackInput) {
    const row = await getPrisma().surveyFeedback.create({
      data: { methodologyVersion: input.methodologyVersion, rating: input.rating, helpedDecision: input.helpedDecision ?? null },
      select: { id: true },
    });
    return { id: row.id };
  },

  async listFeedback(): Promise<FeedbackLike[]> {
    const rows = await getPrisma().surveyFeedback.findMany({ orderBy: { submittedAt: "asc" } });
    return rows.map((r) => ({ id: r.id, submittedAt: r.submittedAt.toISOString(), methodologyVersion: r.methodologyVersion, rating: r.rating, helpedDecision: r.helpedDecision }));
  },
};
