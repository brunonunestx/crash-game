/*
  Warnings:

  - You are about to drop the column `userEmail` on the `Wallet` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[owner]` on the table `Wallet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `owner` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Wallet_userEmail_idx";

-- DropIndex
DROP INDEX "Wallet_userEmail_key";

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "userEmail",
ADD COLUMN     "owner" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_owner_key" ON "Wallet"("owner");

-- CreateIndex
CREATE INDEX "Wallet_owner_idx" ON "Wallet"("owner");
