/*
  Warnings:

  - You are about to drop the column `lirstname` on the `Patient` table. All the data in the column will be lost.
  - Added the required column `firstname` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "lirstname",
ADD COLUMN     "firstname" TEXT NOT NULL;
