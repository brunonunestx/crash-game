-- AlterTable
ALTER TABLE "Inbox" ADD COLUMN     "processed" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Inbox_processed_idx" ON "Inbox"("processed");

-- CreateIndex
CREATE INDEX "Inbox_eventType_idx" ON "Inbox"("eventType");
