-- AlterTable
ALTER TABLE "Treatment" ADD COLUMN     "brand_id" INTEGER,
ADD COLUMN     "expday_no" INTEGER NOT NULL DEFAULT 180;
