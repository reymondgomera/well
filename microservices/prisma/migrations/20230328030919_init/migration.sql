/*
  Warnings:

  - You are about to drop the column `brand_id` on the `Treatment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Treatment" DROP COLUMN "brand_id",
ADD COLUMN     "brandid_no" INTEGER,
ALTER COLUMN "expday_no" DROP DEFAULT;
