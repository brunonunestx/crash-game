/*
  Warnings:

  - A unique constraint covering the columns `[nounce]` on the table `Round` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Round" ADD COLUMN     "nounce" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Round_nounce_key" ON "Round"("nounce");
