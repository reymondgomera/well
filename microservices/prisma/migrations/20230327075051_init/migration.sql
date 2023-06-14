/*
  Warnings:

  - You are about to drop the column `Dietery_Advise` on the `Patient_Medical_Checkup` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Patient_Medical_Checkup" DROP COLUMN "Dietery_Advise",
ADD COLUMN     "Dietary_Advise" TEXT,
ALTER COLUMN "Date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "Follow_up" DROP NOT NULL;
