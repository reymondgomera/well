/*
  Warnings:

  - Added the required column `physicianId` to the `PhysicalCheckup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Age` to the `Physician` table without a default value. This is not possible if the table is not empty.
  - Added the required column `civilstatusId` to the `Physician` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirth` to the `Physician` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Physician` table without a default value. This is not possible if the table is not empty.
  - Added the required column `genderId` to the `Physician` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PhysicalCheckup" DROP CONSTRAINT "PhysicalCheckup_patientId_fkey";

-- AlterTable
ALTER TABLE "Entity" ALTER COLUMN "deletedAt" DROP NOT NULL,
ALTER COLUMN "isShow" SET DEFAULT true,
ALTER COLUMN "isDefault" SET DEFAULT false,
ALTER COLUMN "isParent" SET DEFAULT false;

-- AlterTable
ALTER TABLE "PhysicalCheckup" ADD COLUMN     "physicianId" TEXT NOT NULL,
ALTER COLUMN "Dietary_Advise" SET DEFAULT 'N/A';

-- AlterTable
ALTER TABLE "Physician" ADD COLUMN     "Age" INTEGER NOT NULL,
ADD COLUMN     "civilstatusId" INTEGER NOT NULL,
ADD COLUMN     "contactNumber" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "genderId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "PhysicalCheckup" ADD CONSTRAINT "PhysicalCheckup_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhysicalCheckup" ADD CONSTRAINT "PhysicalCheckup_physicianId_fkey" FOREIGN KEY ("physicianId") REFERENCES "Physician"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Physician" ADD CONSTRAINT "Physician_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "Reference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Physician" ADD CONSTRAINT "Physician_civilstatusId_fkey" FOREIGN KEY ("civilstatusId") REFERENCES "Reference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
