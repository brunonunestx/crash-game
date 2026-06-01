-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('BET_DONE', 'BET_WINNER');

-- CreateTable
CREATE TABLE "Inbox" (
    "id" TEXT NOT NULL,
    "eventType" "EventType" NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inbox_pkey" PRIMARY KEY ("id")
);
