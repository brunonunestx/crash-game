-- AlterTable
ALTER TABLE "Round" ALTER COLUMN "nounce" DROP DEFAULT;
DROP SEQUENCE "Round_nounce_seq";
