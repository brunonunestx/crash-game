/*
  Warnings:

  - A unique constraint covering the columns `[messageId]` on the table `Inbox` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `messageId` to the `Inbox` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Inbox" ADD COLUMN     "messageId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Inbox_messageId_key" ON "Inbox"("messageId");
