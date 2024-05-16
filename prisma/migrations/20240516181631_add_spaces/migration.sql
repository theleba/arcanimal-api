/*
  Warnings:

  - You are about to drop the column `city` on the `Shelter` table. All the data in the column will be lost.
  - You are about to drop the column `owner_contact` on the `Shelter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Shelter" DROP COLUMN "city",
DROP COLUMN "owner_contact";
