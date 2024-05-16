/*
  Warnings:

  - You are about to drop the column `capacity` on the `Shelter` table. All the data in the column will be lost.
  - You are about to drop the column `occupation` on the `Shelter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Shelter" DROP COLUMN "capacity",
DROP COLUMN "occupation",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "owner_contact" TEXT,
ADD COLUMN     "spaces" INTEGER;
