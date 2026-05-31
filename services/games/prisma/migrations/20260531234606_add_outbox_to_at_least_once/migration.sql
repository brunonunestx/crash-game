-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('BET_DONE', 'BET_WINNER');

-- CreateTable
CREATE TABLE "Outbox" (
    "id" TEXT NOT NULL,
    "eventType" "EventType" NOT NULL,
    "userEmail" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Outbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Outbox_processed_idx" ON "Outbox"("processed");
