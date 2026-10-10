-- AlterTable
ALTER TABLE "ConfigVersion" ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "requestId" INTEGER;

-- CreateTable
CREATE TABLE "PublishRequest" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "baseVersion" INTEGER NOT NULL,
    "snapshot" JSONB NOT NULL,
    "changes" JSONB NOT NULL,
    "rollbackOf" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'aberto',
    "reviewedBy" TEXT,
    "reviewNote" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "publishedVersion" INTEGER,

    CONSTRAINT "PublishRequest_pkey" PRIMARY KEY ("id")
);
