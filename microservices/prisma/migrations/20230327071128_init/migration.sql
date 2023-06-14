-- AlterTable
ALTER TABLE "Patient" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Patient_Medical_Checkup" (
    "id" SERIAL NOT NULL,
    "patientId" TEXT NOT NULL,
    "Date" TIMESTAMP(3) NOT NULL,
    "Body_Temp" TEXT NOT NULL,
    "Pulse_Rate" TEXT NOT NULL,
    "Respiration_Rate" TEXT NOT NULL,
    "Blood_Pressure" TEXT NOT NULL,
    "Height" TEXT NOT NULL,
    "Weight" INTEGER NOT NULL,
    "CBG" TEXT NOT NULL,
    "Diagnosis" JSONB NOT NULL,
    "Treatment" JSONB NOT NULL,
    "Dietery_Advise" TEXT NOT NULL,
    "Follow_up" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_Medical_Checkup_id_key" ON "Patient_Medical_Checkup"("id");

-- AddForeignKey
ALTER TABLE "Patient_Medical_Checkup" ADD CONSTRAINT "Patient_Medical_Checkup_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
