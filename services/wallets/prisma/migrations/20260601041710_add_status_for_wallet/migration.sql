-- CreateEnum
CREATE TYPE "WalletStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'CLOSED');

-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "status" "WalletStatus" NOT NULL DEFAULT 'ACTIVE';
