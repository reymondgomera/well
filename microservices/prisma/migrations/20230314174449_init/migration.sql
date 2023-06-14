/*
  Warnings:

  - You are about to drop the column `birthDate` on the `Patient` table. All the data in the column will be lost.
  - Added the required column `Bdate` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Minitial` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactNumber` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "birthDate",
ADD COLUMN     "Bdate" TEXT NOT NULL,
ADD COLUMN     "Minitial" TEXT NOT NULL,
ADD COLUMN     "contactNumber" INTEGER NOT NULL;
