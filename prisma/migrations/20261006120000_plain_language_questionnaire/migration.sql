-- CreateEnum
CREATE TYPE "ProgramActionLabel" AS ENUM ('MANTER', 'AMPLIAR', 'CRIAR', 'MUDAR', 'REDUZIR', 'SEM_PROPOSTA_CLARA');

-- AlterTable
ALTER TABLE "Evidence" ADD COLUMN     "inForce" BOOLEAN;

-- AlterTable
ALTER TABLE "ProgramSummary" ADD COLUMN     "actionLabel" "ProgramActionLabel";

-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "priorityQuestion" TEXT;

-- CreateTable
CREATE TABLE "CandidateProfile" (
    "candidateId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CandidateProfile_pkey" PRIMARY KEY ("candidateId")
);

-- AddForeignKey
ALTER TABLE "CandidateProfile" ADD CONSTRAINT "CandidateProfile_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

