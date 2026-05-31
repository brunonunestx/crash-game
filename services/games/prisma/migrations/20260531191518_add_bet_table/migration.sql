-- CreateTable
CREATE TABLE "Bet" (
    "id" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Bet_roundId_idx" ON "Bet"("roundId");

-- CreateIndex
CREATE INDEX "Bet_userEmail_idx" ON "Bet"("userEmail");

-- CreateIndex
CREATE INDEX "round_user_idx" ON "Bet"("roundId", "userEmail");

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Round"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
