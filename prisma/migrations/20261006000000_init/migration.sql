-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "QuestionKind" AS ENUM ('AGREEMENT', 'SINGLE_CHOICE', 'MULTI_CHOICE');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('government_plan', 'legislation', 'bill', 'roll_call_vote', 'official_statistics', 'official_speech', 'official_interview', 'government_database', 'academic_research', 'international_organization', 'professional_press', 'other');

-- CreateEnum
CREATE TYPE "SourceLegend" AS ENUM ('PRIMARIA', 'ESTATISTICA', 'INSTITUCIONAL', 'ACADEMICA', 'JORNALISTICA');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('VERIFIED', 'PENDING_MANUAL', 'UNVERIFIED');

-- CreateEnum
CREATE TYPE "EvidenceClassification" AS ENUM ('PROPOSTA', 'POSICAO', 'ATUACAO', 'RESULTADO_OBSERVADO');

-- CreateEnum
CREATE TYPE "EvidenceStrength" AS ENUM ('A', 'B', 'C', 'D');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'PUBLISHED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PositionDirection" AS ENUM ('SUPPORTS', 'PARTIALLY_SUPPORTS', 'NEUTRAL', 'PARTIALLY_OPPOSES', 'OPPOSES', 'UNCLEAR');

-- CreateEnum
CREATE TYPE "ContextNoteKind" AS ENUM ('LEGAL', 'CONCEPTUAL', 'HISTORICAL');

-- CreateEnum
CREATE TYPE "AgeRange" AS ENUM ('R16_24', 'R25_34', 'R35_44', 'R45_59', 'R60_PLUS', 'PREFER_NOT');

-- CreateEnum
CREATE TYPE "Region" AS ENUM ('NORTE', 'NORDESTE', 'CENTRO_OESTE', 'SUDESTE', 'SUL', 'EXTERIOR', 'PREFER_NOT');

-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "roleContext" TEXT NOT NULL,
    "historySourceIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "subtopics" TEXT[],

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "subtopic" TEXT,
    "order" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "kind" "QuestionKind" NOT NULL,
    "contextNoteIds" TEXT[],
    "argumentsId" TEXT,
    "evidenceDistinctions" TEXT[],

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionOption" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "normalizedValue" INTEGER,
    "isNoOpinion" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "QuestionOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContextNote" (
    "id" TEXT NOT NULL,
    "kind" "ContextNoteKind" NOT NULL,
    "title" TEXT NOT NULL,
    "paragraphs" TEXT[],
    "sourceIds" TEXT[],
    "asOf" TIMESTAMP(3) NOT NULL,
    "timeline" JSONB,

    CONSTRAINT "ContextNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArgumentSet" (
    "id" TEXT NOT NULL,
    "policy" TEXT NOT NULL,
    "inFavor" TEXT[],
    "against" TEXT[],

    CONSTRAINT "ArgumentSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "documentUrl" TEXT,
    "type" "SourceType" NOT NULL,
    "legend" "SourceLegend" NOT NULL,
    "purpose" TEXT NOT NULL,
    "usageRestrictions" TEXT,
    "publishedAt" TIMESTAMP(3),
    "retrievedAt" TIMESTAMP(3),
    "archivedUrl" TEXT,
    "hash" TEXT,
    "notes" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "verificationCheckedAt" TIMESTAMP(3),
    "verificationNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evidence" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "questionId" TEXT,
    "topicId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "originalExcerpt" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "sourceType" "SourceType" NOT NULL,
    "eventDate" TIMESTAMP(3),
    "publicationDate" TIMESTAMP(3),
    "retrievedAt" TIMESTAMP(3) NOT NULL,
    "classification" "EvidenceClassification" NOT NULL,
    "evidenceStrength" "EvidenceStrength" NOT NULL,
    "reviewStatus" "ReviewStatus" NOT NULL DEFAULT 'DRAFT',
    "classificationCriterion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidatePosition" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "direction" "PositionDirection" NOT NULL,
    "closestOptionId" TEXT,
    "summary" TEXT NOT NULL,
    "dimension" TEXT,
    "reviewStatus" "ReviewStatus" NOT NULL DEFAULT 'DRAFT',
    "timeline" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CandidatePosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidatePositionEvidence" (
    "positionId" TEXT NOT NULL,
    "evidenceId" TEXT NOT NULL,

    CONSTRAINT "CandidatePositionEvidence_pkey" PRIMARY KEY ("positionId","evidenceId")
);

-- CreateTable
CREATE TABLE "LegislativeAction" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "externalId" TEXT,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "sourceId" TEXT NOT NULL,
    "reviewStatus" "ReviewStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LegislativeAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicPolicy" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "sourceId" TEXT NOT NULL,
    "reviewStatus" "ReviewStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublicPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Indicator" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surveyName" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "referencePeriod" TEXT NOT NULL,
    "releasedAt" TIMESTAMP(3) NOT NULL,
    "methodologyNote" TEXT,
    "contemporaneousPolicies" TEXT[],
    "reviewStatus" "ReviewStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Indicator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramSummary" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "themeKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "documentalStatus" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "documentDate" TIMESTAMP(3),
    "proposalDetails" JSONB,
    "reviewStatus" "ReviewStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvidenceReview" (
    "id" TEXT NOT NULL,
    "evidenceId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "classificationVersion" TEXT NOT NULL,
    "previousClassification" JSONB,
    "newClassification" JSONB NOT NULL,
    "reason" TEXT NOT NULL,
    "blind" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EvidenceReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MethodologyVersion" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "effectiveUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changeLog" TEXT[],

    CONSTRAINT "MethodologyVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchProtocol" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "subtopic" TEXT NOT NULL,
    "searchTerms" TEXT[],
    "sourceIds" TEXT[],
    "period" TEXT NOT NULL,
    "inclusionCriteria" TEXT[],
    "exclusionCriteria" TEXT[],
    "definedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResearchProtocol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChangeLog" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChangeLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "operation" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "reason" TEXT NOT NULL,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RawDocument" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "adapter" TEXT NOT NULL,
    "externalId" TEXT,
    "url" TEXT NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contentType" TEXT,
    "content" TEXT,
    "hash" TEXT,
    "metadata" JSONB,

    CONSTRAINT "RawDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LlmClassification" (
    "id" TEXT NOT NULL,
    "evidenceId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "modelVersion" TEXT NOT NULL,
    "rawResponse" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "LlmClassification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveySubmission" (
    "id" TEXT NOT NULL,
    "methodologyVersion" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "answers" JSONB NOT NULL,
    "topicPriorities" JSONB NOT NULL,
    "optionalAgeRange" "AgeRange",
    "optionalRegion" "Region",

    CONSTRAINT "SurveySubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionAggregate" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "responseCount" INTEGER NOT NULL,
    "methodologyVersion" TEXT NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionAggregate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyFeedback" (
    "id" TEXT NOT NULL,
    "methodologyVersion" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rating" INTEGER NOT NULL,
    "helpedDecision" BOOLEAN,

    CONSTRAINT "SurveyFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_slug_key" ON "Candidate"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_slug_key" ON "Topic"("slug");

-- CreateIndex
CREATE INDEX "Question_topicId_idx" ON "Question"("topicId");

-- CreateIndex
CREATE INDEX "QuestionOption_questionId_idx" ON "QuestionOption"("questionId");

-- CreateIndex
CREATE INDEX "Evidence_candidateId_questionId_idx" ON "Evidence"("candidateId", "questionId");

-- CreateIndex
CREATE INDEX "Evidence_reviewStatus_idx" ON "Evidence"("reviewStatus");

-- CreateIndex
CREATE INDEX "CandidatePosition_candidateId_questionId_idx" ON "CandidatePosition"("candidateId", "questionId");

-- CreateIndex
CREATE INDEX "LegislativeAction_candidateId_idx" ON "LegislativeAction"("candidateId");

-- CreateIndex
CREATE INDEX "PublicPolicy_candidateId_idx" ON "PublicPolicy"("candidateId");

-- CreateIndex
CREATE INDEX "ProgramSummary_candidateId_themeKey_idx" ON "ProgramSummary"("candidateId", "themeKey");

-- CreateIndex
CREATE INDEX "EvidenceReview_evidenceId_idx" ON "EvidenceReview"("evidenceId");

-- CreateIndex
CREATE UNIQUE INDEX "MethodologyVersion_version_key" ON "MethodologyVersion"("version");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchProtocol_questionId_key" ON "ResearchProtocol"("questionId");

-- CreateIndex
CREATE INDEX "AuditLog_entity_entityId_idx" ON "AuditLog"("entity", "entityId");

-- CreateIndex
CREATE INDEX "RawDocument_sourceId_externalId_idx" ON "RawDocument"("sourceId", "externalId");

-- CreateIndex
CREATE INDEX "SurveySubmission_submittedAt_idx" ON "SurveySubmission"("submittedAt");

-- CreateIndex
CREATE INDEX "SurveySubmission_methodologyVersion_idx" ON "SurveySubmission"("methodologyVersion");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionAggregate_questionId_optionId_methodologyVersion_key" ON "QuestionAggregate"("questionId", "optionId", "methodologyVersion");

-- CreateIndex
CREATE INDEX "SurveyFeedback_submittedAt_idx" ON "SurveyFeedback"("submittedAt");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionOption" ADD CONSTRAINT "QuestionOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidatePosition" ADD CONSTRAINT "CandidatePosition_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidatePosition" ADD CONSTRAINT "CandidatePosition_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidatePositionEvidence" ADD CONSTRAINT "CandidatePositionEvidence_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "CandidatePosition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidatePositionEvidence" ADD CONSTRAINT "CandidatePositionEvidence_evidenceId_fkey" FOREIGN KEY ("evidenceId") REFERENCES "Evidence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegislativeAction" ADD CONSTRAINT "LegislativeAction_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicPolicy" ADD CONSTRAINT "PublicPolicy_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Indicator" ADD CONSTRAINT "Indicator_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramSummary" ADD CONSTRAINT "ProgramSummary_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramSummary" ADD CONSTRAINT "ProgramSummary_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceReview" ADD CONSTRAINT "EvidenceReview_evidenceId_fkey" FOREIGN KEY ("evidenceId") REFERENCES "Evidence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchProtocol" ADD CONSTRAINT "ResearchProtocol_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawDocument" ADD CONSTRAINT "RawDocument_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LlmClassification" ADD CONSTRAINT "LlmClassification_evidenceId_fkey" FOREIGN KEY ("evidenceId") REFERENCES "Evidence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

