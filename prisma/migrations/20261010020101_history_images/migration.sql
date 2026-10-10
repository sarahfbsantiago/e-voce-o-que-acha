-- CreateTable
CREATE TABLE "HistoryImage" (
    "slug" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistoryImage_pkey" PRIMARY KEY ("slug")
);
