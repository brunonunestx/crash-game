-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ledger" (
    "id" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ledger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userEmail_key" ON "Wallet"("userEmail");

-- CreateIndex
CREATE INDEX "Wallet_userEmail_idx" ON "Wallet"("userEmail");

-- CreateIndex
CREATE INDEX "Ledger_userEmail_idx" ON "Ledger"("userEmail");
