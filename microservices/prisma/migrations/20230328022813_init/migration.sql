/*
  Warnings:

  - You are about to drop the `Patient_Medical_Checkup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Patient_Medical_Checkup" DROP CONSTRAINT "Patient_Medical_Checkup_patientId_fkey";

-- DropTable
DROP TABLE "Patient_Medical_Checkup";

-- CreateTable
CREATE TABLE "PhysicalCheckup" (
    "id" SERIAL NOT NULL,
    "patientId" TEXT NOT NULL,
    "Date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Vital_Sings" JSONB NOT NULL,
    "Diagnosis" JSONB NOT NULL,
    "Treatment" JSONB NOT NULL,
    "Dietary_Advise" TEXT,
    "Follow_up" TIMESTAMP(3)
);

-- CreateIndex
CREATE UNIQUE INDEX "PhysicalCheckup_id_key" ON "PhysicalCheckup"("id");

-- AddForeignKey
ALTER TABLE "PhysicalCheckup" ADD CONSTRAINT "PhysicalCheckup_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
