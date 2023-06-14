/*
  Warnings:

  - You are about to drop the column `address` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirth` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `firstname` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `Patient` table. All the data in the column will be lost.
  - Added the required column `Address` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Age` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DateOfBirth` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `First_Name` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Last_Name` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "address",
DROP COLUMN "age",
DROP COLUMN "dateOfBirth",
DROP COLUMN "firstname",
DROP COLUMN "lastname",
ADD COLUMN     "Address" TEXT NOT NULL,
ADD COLUMN     "Age" INTEGER NOT NULL,
ADD COLUMN     "DateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "First_Name" TEXT NOT NULL,
ADD COLUMN     "Last_Name" TEXT NOT NULL;
