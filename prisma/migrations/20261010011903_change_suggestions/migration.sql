-- CreateTable
CREATE TABLE "ChangeSuggestion" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "questionId" TEXT,
    "suggestion" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'aberta',
    "response" TEXT,
    "respondedBy" TEXT,
    "respondedAt" TIMESTAMP(3),

    CONSTRAINT "ChangeSuggestion_pkey" PRIMARY KEY ("id")
);
