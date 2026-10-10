-- CreateTable
CREATE TABLE "AdminComment" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "target" TEXT NOT NULL,
    "targetId" INTEGER NOT NULL,
    "author" TEXT NOT NULL,
    "body" TEXT NOT NULL,

    CONSTRAINT "AdminComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdminComment_target_targetId_idx" ON "AdminComment"("target", "targetId");
