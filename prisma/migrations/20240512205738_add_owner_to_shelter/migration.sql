/*
  Warnings:

  - You are about to drop the column `description` on the `Shelter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Shelter" DROP COLUMN "description",
ADD COLUMN     "owner" TEXT;
