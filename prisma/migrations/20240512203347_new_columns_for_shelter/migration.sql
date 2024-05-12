-- AlterTable
ALTER TABLE "Shelter" ADD COLUMN     "address" TEXT,
ADD COLUMN     "other_needs" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "needs" SET DEFAULT ARRAY[]::TEXT[];
