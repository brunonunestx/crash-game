-- CreateEnum
CREATE TYPE "RoundStatus" AS ENUM ('STARTING', 'BETTING', 'PLAYING', 'ENDED');

-- AlterTable
ALTER TABLE "Round" ADD COLUMN     "status" "RoundStatus" NOT NULL DEFAULT 'STARTING';
