-- CreateEnum
CREATE TYPE "BetStatus" AS ENUM ('ACTIVE', 'CASHED_OUT', 'LOST');

-- AlterTable
ALTER TABLE "Bet" ADD COLUMN     "status" "BetStatus" NOT NULL DEFAULT 'ACTIVE';
