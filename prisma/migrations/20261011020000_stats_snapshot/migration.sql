-- CreateIndex
CREATE INDEX "SurveySubmission_submittedAt_id_idx" ON "SurveySubmission"("submittedAt", "id");

-- CreateTable
CREATE TABLE "StatsSnapshot" (
    "key" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "cursorAt" TIMESTAMP(3),
    "cursorId" TEXT,
    "processed" INTEGER NOT NULL DEFAULT 0,
    "tally" JSONB NOT NULL,
    "rev" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StatsSnapshot_pkey" PRIMARY KEY ("key")
);
