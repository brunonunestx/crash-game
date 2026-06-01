/*
  Warnings:

  - Added the required column `type` to the `Ledger` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('LOSS', 'WIN', 'DEPOSIT', 'WITHDRAW');

-- AlterTable
ALTER TABLE "Ledger" ADD COLUMN     "type" "TransactionType" NOT NULL;
