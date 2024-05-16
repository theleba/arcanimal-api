-- DropIndex
DROP INDEX "Shelter_email_key";

-- AlterTable
ALTER TABLE "Shelter" ALTER COLUMN "email" DROP NOT NULL;
