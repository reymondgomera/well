/*
  Warnings:

  - Changed the type of `familyHistory` on the `Patient` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `obGyne` on the `Patient` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `pastMedicalHistory` on the `Patient` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `personalHistory` on the `Patient` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Patient" ALTER COLUMN "contactNumber" SET DATA TYPE TEXT,
DROP COLUMN "familyHistory",
ADD COLUMN     "familyHistory" JSONB NOT NULL,
DROP COLUMN "obGyne",
ADD COLUMN     "obGyne" JSONB NOT NULL,
DROP COLUMN "pastMedicalHistory",
ADD COLUMN     "pastMedicalHistory" JSONB NOT NULL,
DROP COLUMN "personalHistory",
ADD COLUMN     "personalHistory" JSONB NOT NULL;
