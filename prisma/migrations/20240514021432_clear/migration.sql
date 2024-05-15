-- AlterTable
ALTER TABLE "Shelter" ALTER COLUMN "other_needs" SET NOT NULL,
ALTER COLUMN "other_needs" SET DEFAULT '',
ALTER COLUMN "other_needs" SET DATA TYPE TEXT;
