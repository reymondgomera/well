/*
  Warnings:

  - You are about to drop the column `contactNumber` on the `Patient` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_civilstatusId_fkey";

-- DropForeignKey
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_genderId_fkey";

-- DropForeignKey
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_occupationId_fkey";

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "contactNumber";
