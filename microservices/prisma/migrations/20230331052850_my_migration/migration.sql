/*
  Warnings:

  - You are about to drop the `Password_reset` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "PhysicalCheckup" ADD COLUMN     "MedicineId" INTEGER;

-- DropTable
DROP TABLE "Password_reset";

-- AddForeignKey
ALTER TABLE "PhysicalCheckup" ADD CONSTRAINT "PhysicalCheckup_MedicineId_fkey" FOREIGN KEY ("MedicineId") REFERENCES "Reference"("id") ON DELETE SET NULL ON UPDATE CASCADE;
