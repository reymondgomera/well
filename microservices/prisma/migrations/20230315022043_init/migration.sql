/*
  Warnings:

  - You are about to drop the column `Bdate` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `Fname` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `Lname` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `Minitial` on the `Patient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[contactNumber]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dateOfBirth` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `familyHistory` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastname` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lirstname` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `middleinitial` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `obGyne` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pastMedicalHistory` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `personalHistory` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "Bdate",
DROP COLUMN "Fname",
DROP COLUMN "Lname",
DROP COLUMN "Minitial",
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "familyHistory" JSONB NOT NULL,
ADD COLUMN     "lastname" TEXT NOT NULL,
ADD COLUMN     "lirstname" TEXT NOT NULL,
ADD COLUMN     "middleinitial" TEXT NOT NULL,
ADD COLUMN     "obGyne" JSONB NOT NULL,
ADD COLUMN     "pastMedicalHistory" JSONB NOT NULL,
ADD COLUMN     "personalHistory" JSONB NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Patient_contactNumber_key" ON "Patient"("contactNumber");

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_civilstatusId_fkey" FOREIGN KEY ("civilstatusId") REFERENCES "CivilStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_occupationId_fkey" FOREIGN KEY ("occupationId") REFERENCES "Occupation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "Gender"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
