-- CreateTable
CREATE TABLE "ConfigVersion" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "sections" TEXT[],
    "changes" JSONB NOT NULL,
    "impact" JSONB NOT NULL,
    "snapshot" JSONB NOT NULL,
    "rollbackOf" INTEGER,

    CONSTRAINT "ConfigVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfigDraft" (
    "id" TEXT NOT NULL,
    "snapshot" JSONB NOT NULL,
    "baseVersion" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConfigDraft_pkey" PRIMARY KEY ("id")
);
