-- DropForeignKey
ALTER TABLE "PhysicalCheckup" DROP CONSTRAINT "PhysicalCheckup_physicianId_fkey";

-- AddForeignKey
ALTER TABLE "PhysicalCheckup" ADD CONSTRAINT "PhysicalCheckup_physicianId_fkey" FOREIGN KEY ("physicianId") REFERENCES "Physician"("id") ON DELETE CASCADE ON UPDATE CASCADE;
